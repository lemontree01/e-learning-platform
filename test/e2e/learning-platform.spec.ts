import { expect, test } from '@playwright/test';

test('the home page focuses on learning and leaves the playground unloaded', async ({ page, }) => {
  const playgroundRequests: string[] = [];
  page.on('request', (request) => {
    if (request.url().includes('/observatory.json')) playgroundRequests.push(request.url());
  });
  await page.goto('/home');
  await expect(page.getByRole('heading', { level: 1, name: 'Learning platform', })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Run the demo', })).toHaveCount(0);
  await expect(page.locator('#observatory')).toHaveCount(0);
  await expect(page.locator('a[href*="#observatory"]')).toHaveCount(0);
  expect(playgroundRequests).toEqual([]);
  await page.getByRole('link', { name: 'Browse courses', exact: true, }).click();
  await expect(page).toHaveURL(/\/courses$/);
});

test('Russian translates the platform, controls, and learning navigation', async ({ page, }) => {
  await page.goto('/home');
  await page.getByRole('button', { name: 'Switch language', }).click();
  await expect(page.getByRole('heading', { name: 'Учебная платформа', exact: true, }))
    .toBeVisible();
  await expect(page).toHaveTitle('Учебная платформа — Курсы программирования');
  await expect(page.getByRole('button', { name: 'Сменить тему', })).toBeVisible();
  await page.getByRole('button', { name: 'Открыть меню', }).click();
  await expect(page.getByRole('complementary', { name: 'Основная навигация', })).toBeVisible();
  await page.getByRole('button', { name: 'Закрыть меню', }).click();
  await page.getByRole('link', { name: 'Выбрать курс', exact: true, }).click();
  await expect(page.getByRole('heading', { level: 1, name: 'Каталог курсов', })).toBeVisible();
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('lang', 'ru');
  await page.goto('/course/12/lesson/0');
  await expect(page.getByRole('link', { name: 'Открыть курс', exact: true, }))
    .toHaveAttribute('href', '/course/12');
  await expect(page.locator('a[href*="#observatory"]')).toHaveCount(0);
  await expect(page.getByRole('heading', { name: 'Шаг 1', })).toBeVisible();
  await page.getByRole('button', { name: 'Запустить', }).click();
  await expect(page.getByText('Веб-скрапинг с помощью Python — шаг 1')).toBeVisible();
  await page.goto('/teachers/1');
  await expect(page.getByRole('heading', { name: 'Эмма Джонсон', exact: true, })).toBeVisible();
});
