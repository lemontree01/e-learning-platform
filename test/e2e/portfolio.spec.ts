import { expect, test } from '@playwright/test';

test('the chapter grid offers direct links, list navigation, refresh and Back', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1100, });
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/home');
  const index = page.locator('[data-course-index]');
  await expect(index.getByRole('link')).toHaveCount(10);
  await expect(
    index.getByRole('link', { name: '01 Your first JavaScript program', })
  ).toBeVisible();
  await expect(
    page.getByRole('link', { name: 'Start learning', exact: true, })
  ).toBeVisible();
  await expect(page.locator('[data-course-index] canvas')).toHaveCount(0);
  await index.getByRole('link').first().hover();
  await page.screenshot({
    path: '.cache/screenshots/portfolio-home-desktop.png',
    fullPage: true,
  });
  await index.getByRole('button', { name: 'List view', }).click();
  await expect(index).toHaveAttribute('data-view', 'list');
  await index.getByRole('link', { name: '02 Variables and value types', }).focus();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/\/course\/0\/lesson\/1$/);
  await expect(
    page.getByRole('heading', { level: 1, name: 'Variables and value types', })
  ).toBeVisible();
  await page.reload();
  await expect(
    page.getByRole('heading', { level: 1, name: 'Variables and value types', })
  ).toBeVisible();
  await page.goBack();
  await expect(page).toHaveURL(/\/home$/);
  expect(errors).toEqual([]);
});

test('the chapter grid works without WebGL', async ({ page, }) => {
  await page.setViewportSize({ width: 1440, height: 1000, });
  await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
      value: function (type: string, ...args: unknown[]) {
        if (type.includes('webgl')) return null;
        return Reflect.apply(original, this, [type, ...args]);
      },
    });
  });
  await page.goto('/home');
  const index = page.locator('[data-course-index]');
  await expect(index).toHaveAttribute('data-view', 'grid');
  await expect(index.getByRole('link')).toHaveCount(10);
  await index.getByRole('link').first().click();
  await expect(
    page.getByRole('heading', { level: 1, name: 'Your first JavaScript program', })
  ).toBeVisible();
});

test('mobile lesson navigation traps focus, restores focus and opens the chosen chapter', async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 812, });
  await page.goto('/course/0/lesson/0');
  const trigger = page.getByRole('button', { name: /Choose a lesson/, });
  await expect(trigger).toBeVisible();
  await expect(trigger).toBeInViewport();
  await trigger.click();
  const drawer = page.getByRole('dialog', { name: 'Choose a lesson', });
  await expect(drawer).toBeVisible();
  await drawer.getByRole('link').last().focus();
  await page.keyboard.press('Tab');
  await expect(
    drawer.getByRole('button', { name: 'Close lesson selector', })
  ).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(drawer).not.toBeVisible();
  await expect(trigger).toBeFocused();
  await trigger.click();
  await drawer.getByRole('link', { name: '03 Expressions and strings', }).click();
  await expect(
    page.getByRole('heading', { level: 1, name: 'Expressions and strings', })
  ).toBeVisible();
  await expect(page.getByRole('button', { name: /Choose a lesson/, })).toBeInViewport();
  await page.screenshot({
    path: '.cache/screenshots/portfolio-lesson-mobile.png',
    fullPage: true,
  });
});

test('Russian homepage fits narrow phone screens', async ({ page, }) => {
  await page.goto('/home');
  await page.getByRole('button', { name: 'Switch language', }).click();
  for (const width of [320, 375]) {
    await page.setViewportSize({ width, height: 812, });
    await expect(
      page.getByRole('heading', {
        level: 1,
        name: 'Своя основа в программировании.',
      })
    ).toBeVisible();
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)
    ).toBe(true);
  }
});

test('the course index remains localized, responsive and readable in both themes', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce', });
  for (const width of [320, 375, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 1000, });
    await page.goto('/home');
    const index = page.locator('[data-course-index]');
    await expect(index.getByRole('link')).toHaveCount(10);
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)
    ).toBe(true);
    if (width < 1024) {
      await expect(page.locator('[data-testid="course-scene"]')).toHaveCount(0);
    }
    if (width === 375) {
      await page.screenshot({
        path: '.cache/screenshots/portfolio-home-mobile.png',
        fullPage: true,
      });
    }
  }
  await page.getByRole('button', { name: 'Switch language', }).click();
  await expect(
    page.getByRole('heading', { level: 1, name: 'Своя основа в программировании.', })
  ).toBeVisible();
  await expect(
    page.locator('[data-course-index]').getByRole('link').first()
  ).toContainText('Первая программа');
  await page.getByRole('button', { name: 'Сменить тему', }).click();
  await expect(page.locator('body')).toHaveCSS(
    'background-color',
    'rgb(255, 255, 255)'
  );
  await page.screenshot({
    path: '.cache/screenshots/portfolio-home-light-ru.png',
    fullPage: true,
  });
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)
  ).toBe(true);
});
