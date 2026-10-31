import { expect, test } from '@playwright/test';
import enMessages from '../../public/locales/en.json';
import ruMessages from '../../public/locales/ru.json';

const en = enMessages.translation;
const ru = ruMessages.translation;

test('returning home from a filtered catalog restores the featured courses', async ({ page, }) => {
  await page.goto('/courses?search=TypeScript');
  await expect(page.getByRole('heading', { level: 2, name: /TypeScript/, })).toBeVisible();
  await page.locator('header').getByRole('link', { name: 'Home', exact: true, }).click();
  await expect(page.getByRole('heading', { level: 3, name: 'HTML and CSS Basics', })).toBeVisible();
  await expect(page.getByRole('heading', { level: 3, name: /TypeScript/, })).toHaveCount(0);
  await expect(page).toHaveTitle(en['app-title']);
});

test('route titles follow navigation and language changes', async ({ page, }) => {
  await page.goto('/courses');
  await expect(page).toHaveTitle(`${en.courses} — ${en['brand-name']}`);
  await page.getByRole('button', { name: en['switch-language'], }).click();
  await expect(page).toHaveTitle(`${ru.courses} — ${ru['brand-name']}`);
  await page.reload();
  await expect(page).toHaveTitle(`${ru.courses} — ${ru['brand-name']}`);
  await expect(page.locator('html')).toHaveAttribute('lang', 'ru');
});

test('concurrent server renders preserve each language', async ({ request, }) => {
  const checks = Array.from({ length: 8, }, async (_, index) => {
    const language = index % 2 === 0 ? 'en' : 'ru';
    const copy = language === 'ru' ? ru : en;
    const response = await request.get('/about', { headers: { Cookie: `lang=${language}`, }, });
    expect(response.ok()).toBe(true);
    const html = await response.text();
    expect(html).toContain(`<html lang="${language}"`);
    expect(html).toContain(`<title>${copy.about} — ${copy['brand-name']}</title>`);
    expect(html).toContain(copy['skip-content']);
  });
  await Promise.all(checks);
});

test('missing pages recover and robots is valid', async ({ page, request, }) => {
  const response = await page.goto('/not-a-real-page');
  expect(response?.status()).toBe(404);
  await expect(page.getByRole('heading', { level: 1, name: 'Page not found', })).toBeVisible();
  await page.getByRole('link', { name: 'Back to courses', }).click();
  await expect(page.getByRole('heading', { level: 1, name: 'Course catalog', })).toBeVisible();
  const robots = await request.get('/robots.txt');
  expect(robots.ok()).toBe(true);
  expect(robots.headers()['content-type']).toContain('text/plain');
  expect(await robots.text()).toContain('User-Agent: *');
});

test('course links and view controls survive an unavailable animation chunk', async ({ page, }) => {
  const errors: string[] = [];
  let blocked = 0;
  page.on('pageerror', error => errors.push(error.message));
  await page.route(/\/motion-features\.[^/]+\.js$/, async route => {
    blocked += 1;
    await route.abort();
  });
  await page.goto('/home');
  await expect.poll(() => blocked).toBeGreaterThan(0);
  const index = page.locator('[data-course-index]');
  await expect(index.getByRole('link')).toHaveCount(10);
  await index.getByRole('button', { name: 'List view', }).click();
  await expect(index).toHaveAttribute('data-view', 'list');
  await index.getByRole('link').first().click();
  await expect(page.getByRole('heading', {
    level: 1, name: 'Your first JavaScript program',
  })).toBeVisible();
  expect(errors).toEqual([]);
});

for (const language of ['en', 'ru']) {
  test(`fonts download once in ${language}`, async ({ page, context, baseURL, }) => {
    if (!baseURL) throw new Error('A test server URL is required.');
    await context.addCookies([{ name: 'lang', value: language, url: baseURL, }]);
    const fonts: string[] = [];
    page.on('request', request => {
      if (request.url().endsWith('.woff2')) fonts.push(request.url());
    });
    await page.goto('/home');
    await page.evaluate(async () => await document.fonts.ready);
    const preloads = await page.locator('link[rel="preload"][as="font"]').evaluateAll(
      links => links.map(link => (link as HTMLLinkElement).href)
    );
    expect(preloads).toHaveLength(language === 'ru' ? 4 : 2);
    expect(fonts).toHaveLength(preloads.length);
    expect(new Set(fonts).size).toBe(fonts.length);
    for (const url of preloads) expect(fonts).toContain(url);
  });
}
