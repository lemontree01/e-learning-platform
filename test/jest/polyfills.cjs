const { TextEncoder, TextDecoder } = require('node:util');

// React Router uses these standard browser APIs; Jest 29's jsdom omits them.
globalThis.TextEncoder ??= TextEncoder;
globalThis.TextDecoder ??= TextDecoder;
