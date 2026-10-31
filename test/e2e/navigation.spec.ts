import { expect, test } from '@playwright/test';

// Course and lesson pages are rendered on the server with their data, so moving between them
// in the browser fetches no course or lesson JSON.
test('course and lesson pages arrive with their data and navigate without API requests', async ({
  page, request,
}) => {
  const overview = await (await request.get('/course/0')).text();
  expect(overview).toContain('JavaScript Fundamentals');
  expect(overview).toContain('Variables and value types');
  const requested: string[] = [];
  page.on('request', request => {
    const path = new URL(request.url()).pathname;
    if (path.startsWith('/api/courses')) requested.push(path);
  });
  await page.setViewportSize({ width: 1440, height: 1000, });
  await page.goto('/course/0');
  await expect(page.getByRole('heading', { level: 1, name: 'JavaScript Fundamentals', }))
    .toBeVisible();
  await page.getByRole('link', { name: /01 Your first JavaScript program/, }).click();
  await expect(page.getByRole('heading', { level: 1, name: 'Your first JavaScript program', }))
    .toBeVisible();
  await page.locator('.desktop-outline')
    .getByRole('link', { name: '02 Variables and value types', }).click();
  await expect(page.getByRole('heading', { level: 1, name: 'Variables and value types', }))
    .toBeVisible();
  await page.goBack();
  await expect(page.getByRole('heading', { level: 1, name: 'Your first JavaScript program', }))
    .toBeVisible();
  expect(requested).toEqual([]);
});

test('lesson changes reuse the course without restarting the page', async ({ page, }) => {
  await page.setViewportSize({ width: 1440, height: 1000, });
  const requests: string[] = [];
  const errors: string[] = [];
  page.on('request', (request) => {
    if (new URL(request.url()).pathname === '/api/courses/0') requests.push(request.url());
  });
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/course/0/lesson/0');
  await expect(page.getByRole('heading', { level: 1, name: 'Your first JavaScript program', }))
    .toBeVisible();
  const initialRequests = requests.length;
  // The server rendered the course, so the browser never fetched it.
  expect(initialRequests).toBe(0);
  const shell = await page.locator('main > div').elementHandle();
  const outline = page.locator('.desktop-outline');
  await outline.getByRole('link', { name: '02 Variables and value types', }).click();
  await expect(page.getByRole('heading', { level: 1, name: 'Variables and value types', }))
    .toBeVisible();
  expect(await shell?.evaluate((element) => element.isConnected)).toBe(true);
  expect(requests).toHaveLength(initialRequests);
  await expect(page.locator('main > div')).toHaveCSS('opacity', '1');
  await page.screenshot({ path: '.cache/screenshots/navigation-lesson.png', fullPage: true, });
  await page.goBack();
  await expect(page.getByRole('heading', { level: 1, name: 'Your first JavaScript program', }))
    .toBeVisible();
  expect(requests).toHaveLength(initialRequests);
  await page.getByRole('link', { name: 'View course', exact: true, }).click();
  await expect(page.getByRole('heading', { level: 1, name: 'JavaScript Fundamentals', }))
    .toBeVisible();
  expect(requests).toHaveLength(initialRequests);
  expect(errors).toEqual([]);
});

test('main navigation keeps its content container mounted', async ({ page, }) => {
  await page.goto('/home');
  const heading = page.getByRole('heading', {
    level: 1, name: 'Build your programming foundations.',
  });
  await expect(heading).toBeVisible();
  const shell = await page.locator('main > div').elementHandle();
  await page.locator('header').getByRole('link', { name: 'Courses', exact: true, }).click();
  await expect(page.getByRole('heading', { level: 1, name: 'Course catalog', })).toBeVisible();
  expect(await shell?.evaluate((element) => element.isConnected)).toBe(true);
  await expect(page.locator('main > div')).toHaveCSS('opacity', '1');
  await page.locator('header').getByRole('link', { name: 'Home', exact: true, }).click();
  await expect(heading).toBeVisible();
  expect(await shell?.evaluate((element) => element.isConnected)).toBe(true);
});

test('mobile lesson selection closes the drawer without fetching the course again', async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 812, });
  await page.goto('/course/0/lesson/0');
  await page.getByRole('button', { name: /Choose a lesson/, }).click();
  const drawer = page.getByRole('dialog', { name: 'Choose a lesson', });
  const requests: string[] = [];
  page.on('request', (request) => {
    if (new URL(request.url()).pathname === '/api/courses/0') requests.push(request.url());
  });
  await drawer.getByRole('link', { name: '02 Variables and value types', }).click();
  await expect(page.getByRole('heading', { level: 1, name: 'Variables and value types', }))
    .toBeVisible();
  await expect(drawer).not.toBeVisible();
  await expect(page.getByRole('button', { name: /Choose a lesson/, })).toBeInViewport();
  expect(requests).toEqual([]);
});
