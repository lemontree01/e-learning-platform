const test = require('node:test');
const assert = require('node:assert/strict');
const { api, latest, settled, checkCatalog, parseCandidate, waitForAlias, aliasOperation } = require('./release.cjs');

function mockReadApi(t, responses) {
  process.env.GITHUB_TOKEN = 'private-test-token';
  const calls = [], delays = [];
  t.mock.method(global, 'setTimeout', (callback, delay) => { delays.push(delay); queueMicrotask(callback); return 0; });
  t.mock.method(global, 'fetch', async (url, options) => {
    calls.push({ url, options });
    const response = responses[Math.min(calls.length - 1, responses.length - 1)];
    if (response instanceof Error) throw response;
    return response();
  });
  return { calls, delays };
}

test('release API recovers from a transient fetch failure with backoff', async t => {
  const { calls, delays } = mockReadApi(t, [new TypeError('fetch failed'), () => Response.json({ object: { sha: 'current' } })]);
  assert.deepEqual(await api('https://api.github.com', '/repos/owner/app/git/ref/heads/master', 'GITHUB_TOKEN'), { object: { sha: 'current' } });
  assert.equal(calls.length, 2);
  assert.deepEqual(delays, [1000]);
  assert.notEqual(calls[0].options.signal, calls[1].options.signal);
});

test('release API retries transient server and response-body failures', async t => {
  const { calls, delays } = mockReadApi(t, [
    () => new Response('Unavailable', { status: 503 }),
    () => ({ ok: true, text: async () => { throw new TypeError('terminated'); } }),
    () => Response.json({ ok: true }),
  ]);
  assert.deepEqual(await api('https://api.github.com', '/test', 'GITHUB_TOKEN'), { ok: true });
  assert.equal(calls.length, 3);
  assert.deepEqual(delays, [1000, 2000]);
});

test('persistent network failures stop after three attempts with safe endpoint context', async t => {
  const failure = new TypeError('fetch failed private-test-token');
  failure.cause = { code: 'UND_ERR_CONNECT_TIMEOUT' };
  const { calls, delays } = mockReadApi(t, [failure]);
  await assert.rejects(api('https://api.github.com', '/test?secret=hidden', 'GITHUB_TOKEN'), error => {
    assert.match(error.message, /GET api.github.com\/test failed after 3 attempts/);
    assert.match(error.message, /UND_ERR_CONNECT_TIMEOUT/);
    assert.doesNotMatch(error.message, /private-test-token|hidden|secret/);
    return true;
  });
  assert.equal(calls.length, 3);
  assert.deepEqual(delays, [1000, 2000]);
});

test('authentication and rate-limit rejections fail immediately', async t => {
  for (const status of [401, 403, 429]) {
    const { calls, delays } = mockReadApi(t, [() => new Response('{}', { status })]);
    await assert.rejects(api('https://api.github.com', '/test', 'GITHUB_TOKEN'), new RegExp('HTTP ' + status));
    assert.equal(calls.length, 1);
    assert.deepEqual(delays, []);
    t.mock.restoreAll();
  }
});

test('malformed API JSON fails without retrying', async t => {
  const { calls, delays } = mockReadApi(t, [() => new Response('<html>unavailable</html>')]);
  await assert.rejects(api('https://api.github.com', '/test', 'GITHUB_TOKEN'), /invalid JSON response/);
  assert.equal(calls.length, 1);
  assert.deepEqual(delays, []);
});

test('transient write failures are never resent by the API helper', async t => {
  for (const response of [new TypeError('fetch failed'), () => new Response('{}', { status: 503 })]) {
    const { calls, delays } = mockReadApi(t, [response]);
    await assert.rejects(api('https://api.vercel.com', '/promote', 'GITHUB_TOKEN', 'POST'));
    assert.equal(calls.length, 1);
    assert.deepEqual(delays, []);
    t.mock.restoreAll();
  }
});

test('a recovered GitHub request still rejects a stale release commit', async t => {
  process.env.GITHUB_REPOSITORY = 'owner/app';
  process.env.GITHUB_SHA = 'old';
  const { calls } = mockReadApi(t, [new TypeError('fetch failed'), () => Response.json({ object: { sha: 'new' } })]);
  await assert.rejects(latest(), /newer master commit exists/);
  assert.equal(calls.length, 2);
});
test('unfinished or unknown remote promotions stop releases', () => {
  for (const jobStatus of ['pending','in-progress','unknown',undefined]) assert.throws(() => settled({jobStatus}));
  for (const jobStatus of ['succeeded','failed','skipped']) assert.doesNotThrow(() => settled({jobStatus}));
  assert.doesNotThrow(() => settled(null));
});
test('release smoke check requires actual catalog records', () => {
  assert.doesNotThrow(() => checkCatalog('[{"id":1,"name":"Course"}]'));
  for (const value of ['[]','{}','[{"id":"1","name":"bad"}]','<html>']) assert.throws(() => checkCatalog(value));
});

test('pinned Vercel JSON output must describe a ready production candidate', () => {
  const deployment = {url:'https://release-example.vercel.app',readyState:'READY',target:'production'};
  assert.equal(parseCandidate(JSON.stringify({status:'ok',deployment})), deployment.url);
  assert.equal(parseCandidate(JSON.stringify(deployment)), deployment.url);
  for (const value of [{status:'error',deployment},{status:'ok',deployment:{...deployment,target:'preview'}},{status:'ok',deployment:{...deployment,readyState:'ERROR'}},{status:'ok',deployment:{...deployment,url:'https://example.com'}}]) assert.throws(() => parseCandidate(JSON.stringify(value)));
});

function mockAliasApi(t, states, postStatus = 200, postThrows = false) {
  process.env.VERCEL_TOKEN = 'test-token';
  process.env.VERCEL_PROJECT_ID = 'test-project';
  process.env.VERCEL_ORG_ID = 'test-org';
  let time = 0, reads = 0;
  const calls = [];
  t.mock.method(Date, 'now', () => time);
  t.mock.method(global, 'setTimeout', callback => { time += 2000; queueMicrotask(callback); return 0; });
  t.mock.method(global, 'fetch', async (url, options) => {
    calls.push({url,options});
    if (options.method === 'POST') {
      if (postThrows) throw new Error('Simulated network timeout');
      return new Response('{}', {status:postStatus});
    }
    return Response.json(states[Math.min(reads++,states.length-1)]);
  });
  return calls;
}
const aliasState = (status, target = 'desired', production = 'old') => ({targets:{production:{id:production}},lastAliasRequest:{jobStatus:status,toDeploymentId:target}});
test('alias polling waits through pending states and verifies the production target', async t => {
  mockAliasApi(t,[aliasState('pending'),aliasState('in-progress'),aliasState('succeeded','desired','desired')]);
  await waitForAlias('desired');
});
test('alias polling fails closed on failure, another active target and timeout', async t => {
  for (const state of [aliasState('failed'),aliasState('pending','other'),aliasState('pending'),aliasState('succeeded','desired','wrong')]) {
    mockAliasApi(t,[state]);
    await assert.rejects(waitForAlias('desired'));
    t.mock.restoreAll();
  }
});
test('alias requests include required JSON body and rollback information', async t => {
  const calls = mockAliasApi(t,[{targets:{production:{id:'old'}}},aliasState('succeeded','desired','desired')]);
  await aliasOperation('desired','promote');
  assert.match(calls[0].url,/rollbackInfo=true/);
  const posts = calls.filter(c => c.options.method === 'POST');
  assert.equal(posts.length,1); assert.equal(posts[0].options.body,'{}');
  assert.match(posts[0].url,/v10\/projects\/test-project\/promote\/desired/);
});
test('definitive API rejection is reported without polling or retrying', async t => {
  const calls = mockAliasApi(t,[{}],403);
  await assert.rejects(aliasOperation('desired','rollback'),/HTTP 403/);
  assert.equal(calls.length,2);
});
test('ambiguous network failure reconciles a successful remote request without retry', async t => {
  const calls = mockAliasApi(t,[{},aliasState('pending'),aliasState('succeeded','desired','desired')],200,true);
  await aliasOperation('desired','promote');
  assert.equal(calls.filter(c => c.options.method === 'POST').length,1);
});
