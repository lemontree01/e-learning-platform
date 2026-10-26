const fs = require('node:fs');
const path = require('node:path');
const { createHash } = require('node:crypto');
const { buildSync } = require('esbuild');
const { frame } = require('./playground-security.cjs');
const root = path.resolve(__dirname, '..');
const output = path.join(root, 'public/code-runtime');
fs.mkdirSync(output, { recursive: true });
fs.mkdirSync(path.join(root, 'public/code-sandbox'), { recursive: true });
fs.writeFileSync(path.join(root, 'public/code-sandbox/frame.html'),
  '<!doctype html><meta charset="utf-8"><title>Code sandbox</title><script>' + frame + '</script>');
const result = buildSync({
  absWorkingDir: root, entryPoints: [path.join(root, 'scripts/playground/worker.mjs')], bundle: true,
  tsconfigRaw: {},
  write: false, format: 'iife', platform: 'browser', target: 'es2022', minify: true,
  legalComments: 'inline', metafile: true,
});
if (Object.values(result.metafile.outputs).some(file => file.imports.length)) {
  throw new Error('The sandbox Worker must have no external module dependencies.');
}
const assets = {};
function add(name, bytes) {
  const digest = createHash('sha256').update(bytes).digest();
  const extension = path.extname(name);
  const filename = name.slice(0, -extension.length) + '.' + digest.toString('hex').slice(0, 16) + extension;
  fs.writeFileSync(path.join(output, filename), bytes);
  assets[name] = { url: '/code-runtime/' + filename, integrity: 'sha256-' + digest.toString('base64'), bytes: bytes.length };
}
add('worker.js', result.outputFiles[0].contents);
add('quickjs.wasm', fs.readFileSync(require.resolve('@jitl/quickjs-wasmfile-release-sync/wasm')));
const pythonBundle = buildSync({
  absWorkingDir: root, entryPoints: [path.join(root, 'scripts/playground/python.mjs')],
  tsconfigRaw: {}, bundle: true, write: false, format: 'iife', platform: 'browser',
  target: 'es2022', minify: true, legalComments: 'inline',
  external: ['node:*', 'ws'],
});
add('python.js', pythonBundle.outputFiles[0].contents);
const python = path.dirname(require.resolve('pyodide/package.json'));
for (const name of ['pyodide.asm.wasm', 'python_stdlib.zip', 'pyodide-lock.json']) {
  add(name, fs.readFileSync(path.join(python, name)));
}
fs.writeFileSync(path.join(output, 'manifest.json'), JSON.stringify({
  versions: { quickjs: '0.32.0', pyodide: '314.0.7' }, assets,
}));
fs.writeFileSync(path.join(output, 'THIRD_PARTY_NOTICES.txt'),
  'QuickJS-WASM 0.32.0: MIT; https://github.com/justjake/quickjs-emscripten\n' +
  'Pyodide 314.0.7: MPL-2.0; unmodified runtime source: https://github.com/pyodide/pyodide/tree/314.0.7\n' +
  'CPython: Python Software Foundation license; https://docs.python.org/3/license.html\n' +
  fs.readFileSync(path.join(root, 'node_modules/@jitl/quickjs-wasmfile-release-sync/LICENSE'), 'utf8'));
console.log('Built self-hosted, content-addressed JavaScript/Python sandbox assets.');
