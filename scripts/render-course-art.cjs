// Renders one poster per course icon (src/shared/ui/CourseArtwork/courseIcons.ts).
// Output is checked in; normal builds never launch a browser.
const fs = require('node:fs');
const path = require('node:path');
const sharp = require('sharp');
const { renderCanvas } = require('./lib/render-canvas.cjs');

const output = path.resolve('public/images/courses');

renderCanvas('src/shared/ui/CourseArtwork/renderer/poster.ts', { width: 960, height: 576 }, async page => {
  fs.mkdirSync(output, { recursive: true });
  const count = await page.evaluate(() => window.courseCount);
  for (let id = 0; id < count; id++) {
    await page.evaluate(id => { window.renderCourse(id); }, id);
    const screenshot = await page.locator('canvas').screenshot({ omitBackground: true });
    const base = path.join(output, `course-${id}`);
    await sharp(screenshot).resize(480).avif({ quality: 60, effort: 6 }).toFile(`${base}-480.avif`);
    await sharp(screenshot).avif({ quality: 60, effort: 6 }).toFile(`${base}-960.avif`);
    await sharp(screenshot).webp({ quality: 82, alphaQuality: 100 }).toFile(`${base}.webp`);
    const sizes = ['-480.avif', '-960.avif', '.webp'].map(suffix => fs.statSync(base + suffix).size);
    console.log(`course-${id}`, sizes.join(' / '), 'bytes');
  }
}).catch(error => { console.error(error); process.exitCode = 1; });
