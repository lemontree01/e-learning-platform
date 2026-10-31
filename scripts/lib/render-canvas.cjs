// Serves a bundled WebGL entry to a headless browser and hands its ready page to `draw`.
const http = require('node:http');
const { build } = require('esbuild');
const { chromium } = require('@playwright/test');

async function renderCanvas (entry, viewport, draw) {
  const result = await build({ entryPoints: [entry], bundle: true, write: false });
  const server = http.createServer((req, res) => {
    if (req.url === '/scene.js') {
      res.setHeader('content-type', 'text/javascript');
      res.end(result.outputFiles[0].contents);
    } else {
      res.setHeader('content-type', 'text/html');
      res.end('<!doctype html><style>body{margin:0;background:transparent}canvas{display:block}</style><body><script src="/scene.js"></script></body>');
    }
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  let browser;
  try {
    browser = await chromium.launch({
      channel: process.env.PLAYWRIGHT_CHANNEL || (process.platform === 'win32' ? 'msedge' : undefined),
      headless: true,
      args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
    const page = await browser.newPage({ viewport });
    page.on('pageerror', error => console.error(error));
    await page.goto(`http://127.0.0.1:${server.address().port}`);
    await page.waitForSelector('body[data-ready="true"]');
    await draw(page);
  } finally {
    await browser?.close();
    server.close();
  }
}

module.exports = { renderCanvas };
