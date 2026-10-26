const fs = require('node:fs');
const path = require('node:path');
const { createHash } = require('node:crypto');
const frame = fs.readFileSync(path.join(__dirname, 'playground/frame.js'), 'utf8').replaceAll('\r\n', '\n');
const hash = createHash('sha256').update(frame).digest('base64');
const sandboxCsp = [
  "default-src 'none'", "sandbox allow-scripts", "frame-ancestors 'self'",
  `script-src 'sha256-${hash}' blob: 'unsafe-eval' 'wasm-unsafe-eval'`,
  'worker-src blob:', 'connect-src blob:', "frame-src 'none'", "object-src 'none'",
  "base-uri 'none'", "form-action 'none'",
].join('; ');
module.exports = { frame, sandboxCsp };
