import { expect, test, type Page } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';
import { features } from '../../src/shared/config/features';

test.skip(!features.sculpture, 'The sculpture is intentionally hidden by its feature flag.');

const activate = async (page: Page) => {
  await page.getByRole('button', { name: /Explore in 3D/, }).click();
  await expect(page.locator('[data-sculpture]')).toHaveAttribute('data-sculpture', 'ready');
};

test('mobile and tablet defer renderer requests until activation', async ({ page, }) => {
  const scripts: string[] = [];
  page.on('request', request => {
    if (request.resourceType() === 'script') scripts.push(request.url());
  });
  for (const width of [375, 768]) {
    await page.setViewportSize({ width, height: 900, });
    await page.goto('/home');
    await expect(page.locator('[data-sculpture]')).toHaveAttribute('data-sculpture', 'idle');
    await page.getByRole('button', { name: /Explore in 3D/, }).scrollIntoViewIfNeeded();
    await page.waitForTimeout(600);
    await expect(page.locator('canvas')).toHaveCount(0);
    await expect(page.getByRole('slider', { name: 'Folds', exact: true, })).toBeDisabled();
  }
  const before = [...scripts];
  await activate(page);
  expect(scripts.some(url => url.includes('sculpture-renderer'))).toBe(true);
  expect(before.some(url => url.includes('sculpture-renderer'))).toBe(false);
  // In production, also verify every shared Three/Fiber dependency, not just the entry chunk.
  const manifestPath = path.join(
    process.env.SCULPTURE_BUILD_DIR || '.next', 'react-loadable-manifest.json'
  );
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8')) as
  Record<string, { files: string[] }>;
  const renderer = Object.entries(manifest).find(([name]) => name.includes('SculptureRenderer'));
  const existingMotion = Object.entries(manifest).find(([name]) => name.includes('MotionFeatures'));
  expect(renderer).toBeDefined();
  if (!renderer) throw new Error('Renderer dependency manifest is missing');
  for (const file of renderer[1].files) {
    // The course index already loads Motion. Only that existing shared HTML-animation
    // chunk is exempt; it must not contain Three or Fiber code.
    if (existingMotion?.[1].files.includes(file)) {
      const content = fs.readFileSync(path.join(path.dirname(manifestPath), file), 'utf8');
      expect(content).not.toMatch(/WebGLRenderer|react-three|WebGLRenderingContext/);
      continue;
    }
    expect(before.some(url => url.endsWith(file))).toBe(false);
    expect(scripts.some(url => url.endsWith(file))).toBe(true);
  }
});

test('geometry controls, keyboard rotation, wireframe and reset work', async ({ page, }) => {
  await page.setViewportSize({ width: 1440, height: 1000, });
  await page.goto('/home');
  await expect(page.locator('[data-sculpture]')).toHaveAttribute('data-sculpture', 'ready');
  const canvas = page.locator('canvas');
  const initial = await canvas.screenshot();
  const folds = page.getByRole('spinbutton', { name: /folds/, });
  await folds.fill('24');
  await expect(page.getByRole('slider', { name: 'Folds', exact: true, })).toHaveValue('24');
  await page.getByRole('slider', { name: 'Twist', exact: true, }).focus();
  await page.keyboard.press('Home');
  await expect(page.getByRole('spinbutton', { name: /twist/, })).toHaveValue('-180');
  await page.getByRole('slider', { name: 'Spread', exact: true, }).focus();
  await page.keyboard.press('End');
  await expect(page.getByRole('spinbutton', { name: /spread/, })).toHaveValue('1.6');
  await page.waitForTimeout(900);
  expect((await canvas.screenshot()).equals(initial)).toBe(false);
  await page.getByRole('button', { name: 'Wireframe', exact: true, }).click();
  await expect(page.getByRole('button', { name: 'Wireframe', exact: true, }))
    .toHaveAttribute('aria-pressed', 'true');
  const rotation = page.getByRole('group', { name: 'Rotate sculpture', });
  await rotation.focus();
  const beforeRotation = await canvas.screenshot();
  await page.keyboard.press('ArrowRight');
  await page.waitForTimeout(700);
  expect((await canvas.screenshot()).equals(beforeRotation)).toBe(false);
  await page.getByRole('button', { name: 'Reset', exact: true, }).click();
  await expect(folds).toHaveValue('16');
  await expect(page.getByRole('spinbutton', { name: /twist/, })).toHaveValue('120');
  await expect(page.getByRole('spinbutton', { name: /spread/, })).toHaveValue('0.9');
  await expect(page.getByRole('button', { name: 'Solid', exact: true, }))
    .toHaveAttribute('aria-pressed', 'true');
  await page.getByRole('button', { name: 'Toggle theme', exact: true, }).click();
  await rotation.focus();
  await page.keyboard.press('ArrowLeft');
  await expect(rotation).toBeFocused();
  expect(await rotation.evaluate(element => ({
    outline: getComputedStyle(element).outlineStyle,
    color: getComputedStyle(element).outlineColor,
    filter: getComputedStyle(element).filter,
  }))).toEqual({ outline: 'solid', color: 'rgb(17, 17, 17)', filter: 'none', });
});

test('reduced motion requires activation even on desktop', async ({ page, }) => {
  await page.emulateMedia({ reducedMotion: 'reduce', });
  await page.setViewportSize({ width: 1440, height: 1000, });
  await page.goto('/home');
  await expect(page.locator('[data-sculpture]')).toHaveAttribute('data-sculpture', 'idle');
  await expect(page.locator('canvas')).toHaveCount(0);
  await activate(page);
  await page.getByRole('spinbutton', { name: /folds/, }).fill('32');
  await expect(page.getByRole('slider', { name: 'Folds', exact: true, })).toHaveValue('32');
});

for (const failure of ['download', 'webgl', 'context-loss'] as const) {
  test(`${failure} restores artwork and keeps course navigation usable`, async ({ page, }) => {
    await page.setViewportSize({ width: 375, height: 900, });
    if (failure === 'download') {
      await page.route('**/*sculpture-renderer*', async route => { await route.abort(); });
    } else if (failure === 'webgl') {
      await page.addInitScript(() => {
        const original = HTMLCanvasElement.prototype.getContext;
        HTMLCanvasElement.prototype.getContext = function (
          this: HTMLCanvasElement, ...args: Parameters<typeof original>
        ) {
          return String(args[0]).includes('webgl') ? null : original.apply(this, args);
        } as typeof original;
      });
    }
    await page.goto('/home');
    if (failure === 'context-loss') {
      await activate(page);
      await page.locator('canvas').evaluate(canvas => {
        (canvas as HTMLCanvasElement).getContext('webgl2')
          ?.getExtension('WEBGL_lose_context')?.loseContext();
      });
    } else {
      await page.getByRole('button', { name: /Explore in 3D/, }).click();
    }
    await expect(page.locator('[data-sculpture]')).toHaveAttribute('data-sculpture', 'error');
    await expect(page.getByAltText(/continuous ceramic ribbon/)).toBeVisible();
    await expect(page.getByRole('slider', { name: 'Folds', exact: true, })).toBeDisabled();
    await page.getByRole('link', { name: /Start learning/, }).click();
    await expect(page).toHaveURL(/\/course\/0\/lesson\/0/);
    await expect(page.locator('[data-sculpture]')).toHaveCount(0);
  });
}

test('leaving the homepage releases the WebGL context', async ({ page, }) => {
  await page.setViewportSize({ width: 1440, height: 1000, });
  await page.goto('/home');
  await expect(page.locator('[data-sculpture]')).toHaveAttribute('data-sculpture', 'ready');
  const canvas = await page.locator('canvas').elementHandle();
  await page.getByRole('link', { name: /Browse courses/, }).click();
  await expect(page).toHaveURL(/\/courses/);
  await expect(page.locator('canvas')).toHaveCount(0);
  await expect.poll(async () => await canvas?.evaluate(element => {
    return (element as HTMLCanvasElement).getContext('webgl2')?.isContextLost();
  })).toBe(true);
});

test('rendering settles, pauses when hidden, and caps resolution', async ({ page, }) => {
  await page.addInitScript(() => {
    const original = WebGL2RenderingContext.prototype.drawElements;
    WebGL2RenderingContext.prototype.drawElements = function (...args) {
      document.documentElement.dataset.sculptureDraws = String(
        Number(document.documentElement.dataset.sculptureDraws || 0) + 1
      );
      original.apply(this, args);
    };
  });
  await page.setViewportSize({ width: 1440, height: 1000, });
  await page.goto('/home');
  await expect(page.locator('[data-sculpture]')).toHaveAttribute('data-sculpture', 'ready');
  await page.waitForTimeout(900);
  const draws = async () => await page.locator('html').getAttribute('data-sculpture-draws');
  const initial = await draws();
  await page.waitForTimeout(400);
  expect(await draws()).toBe(initial);
  expect(await page.locator('canvas').evaluate(canvas => {
    return (canvas as HTMLCanvasElement).width / canvas.getBoundingClientRect().width;
  })).toBeLessThanOrEqual(1.5);
  await page.evaluate(() => {
    Object.defineProperty(document, 'visibilityState', { configurable: true, value: 'hidden', });
    document.dispatchEvent(new Event('visibilitychange'));
  });
  await page.getByRole('spinbutton', { name: /folds/, }).fill('30');
  await page.waitForTimeout(400);
  expect(await draws()).toBe(initial);
  await page.evaluate(() => {
    Object.defineProperty(document, 'visibilityState', { configurable: true, value: 'visible', });
    document.dispatchEvent(new Event('visibilitychange'));
  });
  await expect.poll(draws).not.toBe(initial);
  await page.locator('canvas').evaluate(canvas => {
    window.scrollTo(0, window.scrollY + canvas.getBoundingClientRect().bottom + 12);
  });
  await page.waitForTimeout(200);
  const controlsOnly = await draws();
  // Use the lower control so focus scrolling does not bring the canvas back onscreen.
  await page.getByRole('spinbutton', { name: /spread/, }).fill('1.1');
  expect(await page.locator('canvas').evaluate(canvas => canvas.getBoundingClientRect().bottom))
    .toBeLessThan(0);
  await page.waitForTimeout(400);
  expect(await draws()).toBe(controlsOnly);
  await page.evaluate(() => { window.scrollTo(0, document.body.scrollHeight); });
  await page.waitForTimeout(250);
  const offscreen = await draws();
  await page.waitForTimeout(400);
  expect(await draws()).toBe(offscreen);
});

test('touch swipes preserve vertical page scrolling', async ({ page, context, }) => {
  await page.setViewportSize({ width: 375, height: 800, });
  await page.goto('/home');
  await activate(page);
  const canvas = page.locator('canvas');
  await canvas.scrollIntoViewIfNeeded();
  expect(await canvas.evaluate(element => {
    return (element as HTMLCanvasElement).width / element.getBoundingClientRect().width;
  })).toBeLessThanOrEqual(1);
  const bounds = await canvas.boundingBox();
  expect(bounds).not.toBeNull();
  if (!bounds) throw new Error('Sculpture canvas is not visible');
  const session = await context.newCDPSession(page);
  await session.send('Emulation.setTouchEmulationEnabled', { enabled: true, });
  const before = await page.evaluate(() => window.scrollY);
  const x = bounds.x + bounds.width / 2;
  const y = bounds.y + bounds.height * 0.8;
  await session.send('Input.dispatchTouchEvent', {
    type: 'touchStart', touchPoints: [{ x, y, }],
  });
  for (let step = 1; step <= 5; step++) {
    await session.send('Input.dispatchTouchEvent', {
      type: 'touchMove', touchPoints: [{ x, y: y - step * 25, }],
    });
  }
  await session.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [], });
  await expect.poll(async () => await page.evaluate(() => window.scrollY))
    .toBeGreaterThan(before + 40);
  await session.detach();
});
