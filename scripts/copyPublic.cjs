const { cpSync } = require('node:fs');
const path = require('node:path');

const publicDir = path.resolve(__dirname, '../public');
const buildDir = path.resolve(__dirname, '../build');

// Webpack generates index.html; copy the remaining static assets and translations.
cpSync(publicDir, buildDir, {
  recursive: true,
  filter: (source) => source !== path.join(publicDir, 'index.html')
});
