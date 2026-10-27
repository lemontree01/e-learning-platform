const fs = require('node:fs');
const path = require('node:path');
const { gzipSync } = require('node:zlib');

// Include both the shell and route: Next's route table omits some layout chunks.
const directory = path.resolve(process.argv[2] || '.next');
const { pages } = JSON.parse(fs.readFileSync(path.join(directory, 'app-build-manifest.json'), 'utf8'));
if (!pages['/layout'] || !pages['/home/page']) throw new Error('Build the production application first.');
const scripts = [...new Set([...pages['/layout'], ...pages['/home/page']])].filter(file => file.endsWith('.js'));
if (scripts.some(file => /(?:^|\/)main-app\.js$/.test(file))) throw new Error('Use a production build, not next dev.');
const bytes = scripts.reduce((size, file) => size + gzipSync(fs.readFileSync(path.join(directory, file))).length, 0);
const budget = 225 * 1024;
console.log(`Homepage + shared shell: ${(bytes / 1024).toFixed(1)} KiB gzip (budget: ${budget / 1024} KiB).`);
if (bytes > budget) throw new Error('Homepage JavaScript exceeded the mobile performance budget.');
