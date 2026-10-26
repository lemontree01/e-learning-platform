// Load the existing typed configuration explicitly instead of Node's native TS/ESM fallback.
require('ts-node').register({ project: require('node:path').join(__dirname, '../tsconfig.json') });
module.exports = require('./webpack.config.ts').default;
