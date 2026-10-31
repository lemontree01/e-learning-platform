// Reproducible artwork from the same geometry, camera and lighting as the widget.
const fs = require('node:fs');
const path = require('node:path');
const sharp = require('sharp');
const { renderCanvas } = require('./lib/render-canvas.cjs');

renderCanvas('src/widgets/CodeSculpture/renderer/poster.ts', { width: 1080, height: 840 }, async page => {
  const screenshot = await page.locator('canvas').screenshot({ omitBackground: true });
  for (const width of [540, 810, 1080]) {
    const name = width === 1080 ? 'sculpture' : `sculpture-${width}`;
    const destination = path.resolve(`public/images/${name}.avif`);
    fs.mkdirSync(path.dirname(destination), { recursive: true });
    await sharp(screenshot).resize(width).avif({ quality: 60, effort: 6 }).toFile(destination);
    console.log(destination, fs.statSync(destination).size, 'bytes');
  }
  await sharp(screenshot).webp({ quality: 85, alphaQuality: 100 })
    .toFile(path.resolve('public/images/sculpture.webp'));
}).catch(error => { console.error(error); process.exitCode = 1; });
