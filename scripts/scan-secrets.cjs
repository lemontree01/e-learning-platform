const fs = require('node:fs');
const path = require('node:path');
const { createHash, randomUUID } = require('node:crypto');
const { spawnSync } = require('node:child_process');

const root = path.resolve(__dirname, '..');
const version = '8.30.1';
// SHA-256 values from the official release's checksums file. Never use the unrelated npm package.
const releases = {
  'win32-x64': {
    archive: `gitleaks_${version}_windows_x64.zip`,
    sha256: 'd29144deff3a68aa93ced33dddf84b7fdc26070add4aa0f4513094c8332afc4e',
    executable: 'gitleaks.exe',
  },
  'linux-x64': {
    archive: `gitleaks_${version}_linux_x64.tar.gz`,
    sha256: '551f6fc83ea457d62a0d98237cbad105af8d557003051f41f3e7ca7b3f2470eb',
    executable: 'gitleaks',
  },
};

async function main() {
  const gitEnv = {
    ...process.env,
    GIT_CONFIG_COUNT: '1',
    GIT_CONFIG_KEY_0: 'safe.directory',
    GIT_CONFIG_VALUE_0: root.replaceAll('\\', '/'),
  };
  for (const key of ['GIT_DIR', 'GIT_WORK_TREE', 'GIT_INDEX_FILE',
    'GIT_OBJECT_DIRECTORY', 'GIT_ALTERNATE_OBJECT_DIRECTORIES']) delete gitEnv[key];
  const gitOptions = { cwd: root, env: gitEnv, windowsHide: true, encoding: 'utf8' };
  const repository = spawnSync('git', ['rev-parse', '--show-toplevel'], gitOptions);
  if (repository.status !== 0) throw new Error('Secret scanning requires readable Git history.');
  const actualRoot = fs.realpathSync(repository.stdout.trim());
  const expectedRoot = fs.realpathSync(root);
  const sameRoot = process.platform === 'win32'
    ? actualRoot.toLowerCase() === expectedRoot.toLowerCase() : actualRoot === expectedRoot;
  if (!sameRoot) throw new Error('Secret scanner must run at its own repository root.');
  const history = spawnSync('git', ['rev-list', '--all', '--count'], gitOptions);
  if (history.status !== 0 || !/^\d+$/.test(history.stdout.trim()) || Number(history.stdout) < 1) {
    throw new Error('Secret scanning cannot verify the available Git history.');
  }

  const release = releases[`${process.platform}-${process.arch}`];
  if (!release) throw new Error('The secret scanner currently supports Windows x64 and Linux x64.');
  const cache = path.join(root, '.cache', 'security', `gitleaks-${version}`);
  fs.mkdirSync(cache, { recursive: true });
  const archive = path.join(cache, release.archive);
  if (!fs.existsSync(archive)) {
    const response = await fetch(`https://github.com/gitleaks/gitleaks/releases/download/v${version}/${release.archive}`);
    if (!response.ok) throw new Error(`Official Gitleaks download failed (${response.status}).`);
    fs.writeFileSync(archive, Buffer.from(await response.arrayBuffer()));
  }
  const hash = createHash('sha256').update(fs.readFileSync(archive)).digest('hex');
  if (hash !== release.sha256) throw new Error('Gitleaks archive checksum verification failed.');

  // Re-extract from the verified archive on every run rather than trusting a cached executable.
  const extraction = spawnSync('tar', ['-xf', archive, '-C', cache, release.executable], {
    windowsHide: true, stdio: 'pipe',
  });
  if (extraction.status !== 0) throw new Error('Cannot extract the verified Gitleaks binary; tar is required.');
  const binary = path.join(cache, release.executable);
  const config = path.join(root, '.gitleaks.toml');
  let findingCount = 0;
  const runId = randomUUID();

  for (const source of ['git', 'dir']) {
    const report = path.join(cache, `${source}-${runId}-redacted.json`);
    const args = [source, root, '--config', config, '--redact=100', '--no-banner',
      '--report-format', 'json', '--report-path', report, '--log-level', 'error'];
    if (source === 'git') args.push('--log-opts=--all');
    const result = spawnSync(binary, args, {
      cwd: root, windowsHide: true, stdio: 'pipe', encoding: 'utf8',
      env: gitEnv,
    });
    if (result.status !== 0 && result.status !== 1) {
      throw new Error(`Gitleaks ${source} scan failed; inspect scanner configuration and Git availability.`);
    }
    let findings;
    try {
      findings = JSON.parse(fs.readFileSync(report, 'utf8'));
    } catch {
      throw new Error(`Gitleaks ${source} scan did not produce a readable, fresh report.`);
    }
    if (!Array.isArray(findings) || (result.status === 1 && findings.length === 0)) {
      throw new Error(`Gitleaks ${source} scan failed without a valid findings report.`);
    }
    findingCount += findings.length;
    console.log(`${source === 'git' ? 'Git history' : 'Working tree'}: ${findings.length} secret findings.`);
    // Never forward raw scanner output or secret/match fields to terminal logs.
    for (const finding of findings) {
      console.error(`${finding.RuleID}: ${finding.File}:${finding.StartLine}`);
    }
  }
  if (findingCount) process.exitCode = 1;
}

main().catch((error) => { console.error(error.message); process.exitCode = 1; });
