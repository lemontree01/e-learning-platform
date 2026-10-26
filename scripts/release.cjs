const fs = require('node:fs');
const { spawnSync } = require('node:child_process');
const org = process.env.VERCEL_ORG_ID;
const project = process.env.VERCEL_PROJECT_ID;
function required(key) { if (!process.env[key]) throw new Error('Missing '+key); return process.env[key]; }
async function api(host, route, token, method = 'GET') {
  const r = await fetch(host+route, { method, headers: { Authorization: 'Bearer '+required(token), 'User-Agent': 'learning-platform-release', Accept: 'application/json', 'Content-Type': 'application/json' }, ...(method === 'POST' ? {body:'{}'} : {}), signal: AbortSignal.timeout(30000) });
  if (!r.ok) {
    const error = new Error('Release API request failed: HTTP '+r.status);
    error.status = r.status; throw error;
  }
  const body = await r.text();
  return body ? JSON.parse(body) : null;
}
function vercel(args, capture = false) {
  const cli = process.env.VERCEL_CLI;
  const r = spawnSync(cli ? process.execPath : 'vercel', cli ? [cli, ...args] : args, {
    env: { ...process.env, CI: '1', VERCEL_TELEMETRY_DISABLED: '1' }, encoding: 'utf8',
    stdio: capture ? ['ignore', 'pipe', 'inherit'] : 'inherit', timeout: 600000, windowsHide: true,
  });
  if (r.status !== 0) throw new Error('Vercel command failed: '+args[0]);
  return (r.stdout || '').trim();
}
async function latest() {
  const data = await api('https://api.github.com', '/repos/'+required('GITHUB_REPOSITORY')+'/git/ref/heads/master', 'GITHUB_TOKEN');
  if (data.object?.sha !== required('GITHUB_SHA')) throw new Error('A newer master commit exists; this release is stale.');
}
function settled(request) {
  if (!request) return;
  if (!['succeeded', 'failed', 'skipped'].includes(request.jobStatus)) throw new Error('A remote promotion/rollback is unfinished or unknown. Resolve it in Vercel before releasing.');
}
async function projectData() {
  return api('https://api.vercel.com', '/v9/projects/'+required('VERCEL_PROJECT_ID')+'?rollbackInfo=true&teamId='+required('VERCEL_ORG_ID'), 'VERCEL_TOKEN');
}
async function projectState() {
  const state = await projectData();
  settled(state.lastAliasRequest);
  return state;
}
function output(name, value) {
  if (process.env.GITHUB_OUTPUT) fs.appendFileSync(process.env.GITHUB_OUTPUT, name+'='+value+'\n');
}
async function stage() {
  await latest(); const current = await projectState();
  fs.mkdirSync('.vercel', { recursive: true }); fs.writeFileSync('.vercel/project.json', JSON.stringify({ orgId: org, projectId: project }));
  vercel(['pull', '--yes', '--environment=production']);
  vercel(['build', '--prod']);
  await latest();
  const url = parseCandidate(vercel(['deploy', '--prebuilt', '--prod', '--skip-domain', '--yes', '--json', '--meta', 'releaseSha='+required('GITHUB_SHA'), '--meta', 'releaseRepository='+required('GITHUB_REPOSITORY')], true));
  if (!/^https:\/\/[a-z0-9-]+\.vercel\.app$/.test(url)) throw new Error('Unexpected candidate deployment URL.');
  output('url', url); output('previous', current.targets?.production?.id || '');
  if (process.env.GITHUB_STEP_SUMMARY) fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, 'Candidate: '+url+'\n\nPrevious production: '+(current.targets?.production?.id || 'unknown')+'\n\nSource: '+process.env.GITHUB_SHA+'\n');
}
function parseCandidate(output) {
  const result = JSON.parse(output);
  const data = result.deployment || result;
  if ((result.status !== undefined && result.status !== 'ok') || data.readyState !== 'READY' || data.target !== 'production') throw new Error('The production candidate is not ready.');
  const url = data.url;
  if (!/^https:\/\/[a-z0-9-]+\.vercel\.app$/.test(url)) throw new Error('Unexpected candidate deployment URL.');
  return url;
}
function candidateUrl() {
  const url = required('CANDIDATE_URL');
  if (!/^https:\/\/[a-z0-9-]+\.vercel\.app$/.test(url)) throw new Error('Invalid candidate URL.');
  return url;
}
function checkCatalog(body) {
  const courses = JSON.parse(body);
  if (!Array.isArray(courses) || !courses.length || !courses.every(c => Number.isSafeInteger(c.id) && typeof c.name === 'string')) throw new Error('Catalog smoke check failed.');
}
async function smoke() {
  const url = candidateUrl();
  await deployment(new URL(url).hostname);
  const state = await projectData();
  const bypass = Object.keys(state.protectionBypass || {}).find(key => state.protectionBypass[key].scope === 'automation-bypass');
  if (!bypass) throw new Error('Configure Protection Bypass for Automation in the Vercel project before releasing.');
  const get = async route => {
    const response = await fetch(url+route, {headers:{'x-vercel-protection-bypass':bypass},signal:AbortSignal.timeout(60000),redirect:'error'});
    if (!response.ok) throw new Error('Candidate request failed: HTTP '+response.status);
    return response.text();
  };
  if (process.env.RELEASE_APP === 'backend') {
    if (JSON.parse(await get('/healthz')).status !== 'ok') throw new Error('Health check failed.');
  } else if (!(await get('/home')).includes('<html')) throw new Error('Frontend HTML smoke check failed.');
  checkCatalog(await get('/api/courses?lang=eng'));
  console.log('Candidate health and database-backed catalog checks passed.');
}
async function deployment(id) {
  const data = await api('https://api.vercel.com', '/v13/deployments/'+id+'?teamId='+required('VERCEL_ORG_ID'), 'VERCEL_TOKEN');
  if (data.projectId !== project || data.readyState !== 'READY' || data.target !== 'production') throw new Error('Target must be a ready production build in this project.');
  return data;
}
async function waitForAlias(id) {
  const deadline = Date.now()+180000;
  while (Date.now()<deadline) {
    const state = await projectData(), request = state.lastAliasRequest;
    if (state.targets?.production?.id === id && (!request || request.toDeploymentId === id && request.jobStatus === 'succeeded')) return;
    if (request?.toDeploymentId === id && ['failed','skipped'].includes(request.jobStatus)) throw new Error('Vercel alias operation failed or was skipped. Inspect the dashboard.');
    if (request?.toDeploymentId !== id) settled(request);
    else if (!['pending','in-progress','succeeded'].includes(request.jobStatus)) throw new Error('Unknown Vercel alias state.');
    await new Promise(resolve => setTimeout(resolve,2000));
  }
  throw new Error('Alias operation did not settle within three minutes. It may still run remotely; resolve it in Vercel before another release.');
}
async function aliasOperation(id, action) {
  await projectState();
  const version = action === 'promote' ? 'v10' : 'v1';
  try { await api('https://api.vercel.com', '/'+version+'/projects/'+required('VERCEL_PROJECT_ID')+'/'+action+'/'+id+'?teamId='+required('VERCEL_ORG_ID'), 'VERCEL_TOKEN', 'POST'); }
  catch (error) {
    if (error.status >= 400 && error.status < 500 && error.status !== 408) throw error;
    // An HTTP timeout does not cancel the server request. Reconcile before
    // releasing the GitHub concurrency lock; never launch a second request.
    await waitForAlias(id); return;
  }
  await waitForAlias(id);
  console.log('Production '+action+' settled on '+id+'.');
}
async function promote() {
  await latest();
  const target = await deployment(new URL(candidateUrl()).hostname);
  await latest();
  await aliasOperation(target.id, 'promote');
}
async function publicSmoke() {
  const origin = required('PRODUCTION_URL');
  const r = await fetch(origin+'/api/courses?lang=eng', { signal: AbortSignal.timeout(60000) });
  if (!r.ok) throw new Error('Public production smoke check failed.');
  checkCatalog(await r.text()); console.log('Public production catalog check passed.');
}
async function rollback() {
  const id = required('ROLLBACK_DEPLOYMENT');
  if (!/^dpl_[a-zA-Z0-9]+$/.test(id)) throw new Error('Invalid deployment ID.');
  await deployment(id);
  await aliasOperation(id, 'rollback');
}
async function main() {
  const action = process.argv[2];
  if (action === 'rollback') await rollback(); else if (action === 'stage') await stage(); else if (action === 'smoke') await smoke(); else if (action === 'promote') await promote(); else if (action === 'public-smoke') await publicSmoke(); else throw new Error('Unknown release action.');
}
if (require.main === module) main().catch(error => { console.error(error.message); process.exitCode = 1; });
module.exports = { settled, checkCatalog, parseCandidate, waitForAlias, aliasOperation };
