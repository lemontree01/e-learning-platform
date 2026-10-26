import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page, }) => {
  const course = {
    id: 0,
    name: 'JavaScript Fundamentals',
    author: 'Example Author',
    date: '2023-05-01',
    numberOfLessons: 2,
    lessons: [
      { title: '1. Your first JavaScript program', },
      { title: '2. Variables and value types', }
    ],
  };
  await page.route(/\/api\/courses(?:\/0(?:\/lessons\/\d+)?)?(?:\?|$)/, async (route) => {
    const path = new URL(route.request().url()).pathname;
    const lesson = path.match(/\/lessons\/(\d+)$/);
    if (lesson) {
      const index = Number(lesson[1]);
      await route.fulfill({
        json: {
          ...course.lessons[index],
          blocks: [{ type: 'text', heading: `Example ${index}`, body: `Stored lesson body ${index}`, }],
        },
      });
      return;
    }
    const detail = path.endsWith('/0');
    await route.fulfill({ json: detail ? course : [course], });
  });
});

test('course overview loads no bodies; opening lessons loads and caches only those bodies', async ({
  page,
}) => {
  const requested: string[] = [];
  page.on('request', request => {
    const path = new URL(request.url()).pathname;
    if (path.startsWith('/api/courses/0/lessons/')) requested.push(path);
  });
  await page.setViewportSize({ width: 1440, height: 1000, });
  await page.goto('/course/0');
  await expect(page.getByRole('heading', { level: 1, name: 'JavaScript Fundamentals', }))
    .toBeVisible();
  expect(requested).toEqual([]);
  await page.getByRole('link', { name: /01 Your first JavaScript program/, }).click();
  await expect(page.getByText('Stored lesson body 0')).toBeVisible();
  expect(requested).toEqual(['/api/courses/0/lessons/0']);
  await page.locator('.desktop-outline')
    .getByRole('link', { name: '02 Variables and value types', }).click();
  await expect(page.getByText('Stored lesson body 1')).toBeVisible();
  expect(requested).toEqual(['/api/courses/0/lessons/0', '/api/courses/0/lessons/1']);
  await page.goBack();
  await expect(page.getByText('Stored lesson body 0')).toBeVisible();
  expect(requested).toHaveLength(2);
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
  expect(initialRequests).toBe(1);
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
