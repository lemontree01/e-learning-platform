import { expect, test } from '@playwright/test';
import { features } from '../../src/shared/config/features';

test('the home page focuses on learning and leaves the playground unloaded', async ({ page, }) => {
  const playgroundRequests: string[] = [];
  page.on('request', (request) => {
    if (request.url().includes('/observatory.json')) playgroundRequests.push(request.url());
    if (!features.sculpture && /sculpture-renderer|\/images\/sculpture/.test(request.url())) {
      playgroundRequests.push(request.url());
    }
  });
  await page.goto('/home');
  await expect(page.getByRole('heading', { level: 1, name: 'Build your programming foundations.', })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Run the demo', })).toHaveCount(0);
  await expect(page.locator('#observatory')).toHaveCount(0);
  await expect(page.locator('a[href*="#observatory"]')).toHaveCount(0);
  if (!features.sculpture) {
    await expect(page.locator('[data-sculpture]')).toHaveCount(0);
    await expect(page.getByText('CODE → SCULPTURE', { exact: true, })).toHaveCount(0);
  }
  expect(playgroundRequests).toEqual([]);
  await page.getByRole('link', { name: 'Browse courses', exact: true, }).click();
  await expect(page).toHaveURL(/\/courses$/);
});

test('Russian translates the platform, controls, and learning navigation', async ({ page, }) => {
  await page.goto('/home');
  await page.getByRole('button', { name: 'Switch language', }).click();
  await expect(page.getByRole('heading', { name: 'Освойте программирование с азов.', exact: true, }))
    .toBeVisible();
  await expect(page).toHaveTitle('Учебная платформа — курсы программирования');
  await expect(page.getByRole('button', { name: 'Сменить тему', })).toBeVisible();
  await page.getByRole('button', { name: 'Открыть меню', }).click();
  await expect(page.getByRole('complementary', { name: 'Основная навигация', })).toBeVisible();
  await page.getByRole('button', { name: 'Закрыть меню', }).click();
  await page.getByRole('link', { name: 'Открыть каталог', exact: true, }).click();
  await expect(page.getByRole('heading', { level: 1, name: 'Каталог курсов', })).toBeVisible();
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('lang', 'ru');
  await page.goto('/course/0/lesson/0');
  await expect(page.getByRole('link', { name: 'Открыть курс', exact: true, }))
    .toHaveAttribute('href', '/course/0');
  await expect(page.locator('a[href*="#observatory"]')).toHaveCount(0);
  await expect(page.getByRole('heading', { level: 1, name: 'Первая программа на JavaScript', }))
    .toBeVisible();
  await page.locator('.playground-expected summary').first().click();
  await expect(page.locator('.playground-expected pre').first()).toContainText('Hello, learner!');
  await page.goto('/course/12');
  await expect(page.getByRole('heading', { name: 'Что войдёт в курс', })).toBeVisible();
  await expect(page.getByText('HTTP-запросы и разбор HTML')).toBeVisible();
});
