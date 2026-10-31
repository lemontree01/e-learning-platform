import { expect, test } from '@playwright/test';
import enMessages from '../../public/locales/en.json';
import ruMessages from '../../public/locales/ru.json';

const en = enMessages.translation;
const ru = ruMessages.translation;

const site = new URL(process.env.SITE_URL || 'https://learning-platform-gray-mu.vercel.app').origin;

test('404 titles persist through rendering, language changes and recovery', async ({ page, }) => {
  const response = await page.goto('/not-a-real-page');
  expect(response?.status()).toBe(404);
  const title = `${en['page-not-found']} — ${en['brand-name']}`;
  expect((await response?.text())?.match(/<title>[^<]*<\/title>/g))
    .toEqual([`<title>${title}</title>`]);
  await expect(page).toHaveTitle(title);
  // Next streams metadata for browsers; HTML-only crawlers receive it in <head>.
  await expect(page.locator('title')).toHaveCount(1);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
  await expect(page.locator('link[rel="canonical"]')).toHaveCount(0);
  await page.getByRole('button', { name: en['switch-language'], }).click();
  await expect(page).toHaveTitle(`${ru['page-not-found']} — ${ru['brand-name']}`);
  await page.reload();
  await expect(page).toHaveTitle(`${ru['page-not-found']} — ${ru['brand-name']}`);
  await page.getByRole('link', { name: ru['back-to-courses'], }).click();
  await expect(page).toHaveTitle(`${ru.courses} — ${ru['brand-name']}`);
  await expect(page.locator('meta[name="robots"]')).toHaveCount(0);
});

test('404 metadata is present in the initial head for HTML-only crawlers', async ({ request, }) => {
  const response = await request.get('/not-a-real-page', {
    headers: { 'User-Agent': 'Twitterbot/1.0', Cookie: 'lang=ru', },
  });
  expect(response.status()).toBe(404);
  const head = (await response.text()).split('</head>')[0];
  expect(head.match(/<title>[^<]*<\/title>/g))
    .toEqual([`<title>${ru['page-not-found']} — ${ru['brand-name']}</title>`]);
  expect(head).toContain('name="robots" content="noindex"');
});

test('unmatched nested paths have a 404 title', async ({ page, }) => {
  for (const route of ['/courses/not-a-page', '/course/0/not-a-page', '/course/9999',
    '/course/0/lesson/99', '/course/3/lesson/0']) {
    const response = await page.goto(route);
    expect(response?.status()).toBe(404);
    await expect(page).toHaveTitle(`${en['page-not-found']} — ${en['brand-name']}`);
  }
});

test('canonical and social URLs omit tracking parameters', async ({ page, }) => {
  for (const route of ['/home?utm_source=test', '/about', '/courses?search=TypeScript',
    '/course/3', '/course/0/lesson/2', '/contacts']) {
    await page.goto(route);
    const canonical = new URL(route.split('?')[0], site).href;
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', canonical);
    await expect(page.locator('meta[property="og:url"]')).toHaveAttribute('content', canonical);
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute(
      'content', await page.title()
    );
    await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute('content', 'summary');
  }
  await page.getByRole('button', { name: en['switch-language'], }).click();
  await expect(page.locator('meta[property="og:locale"]')).toHaveAttribute('content', 'ru_RU');
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute(
    'content', `${ru['contact-us']} — ${ru['brand-name']}`
  );
});

test('robots advertises the public canonical sitemap', async ({ request, }) => {
  const robots = await request.get('/robots.txt');
  expect(await robots.text()).toContain(`Sitemap: ${site}/sitemap.xml`);
  const response = await request.get('/sitemap.xml');
  expect(response.ok()).toBe(true);
  expect(response.headers()['content-type']).toContain('xml');
  const xml = await response.text();
  expect(xml).toContain(`<loc>${site}/home</loc>`);
  expect(xml).toContain(`<loc>${site}/courses</loc>`);
  expect(xml).toContain(`<loc>${site}/course/0</loc>`);
  expect(xml).toContain(`<loc>${site}/course/0/lesson/0</loc>`);
  for (const excluded of ['/login', '/register', '/profile', '/api/', '?search=']) {
    expect(xml).not.toContain(excluded);
  }
});
