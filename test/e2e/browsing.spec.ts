import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page, }) => {
  // Keep browser checks independent of third-party font/CDN availability.
  const cdn = /^https:\/\/(fonts\.googleapis\.com|fonts\.gstatic\.com|cdnjs\.cloudflare\.com)\//;
  await page.route(cdn,
    async (route) => { await route.fulfill({ status: 200, contentType: 'text/css', body: '', }); });
});

test('the default black palette is present before React starts', async ({ browser, }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, });
  try {
    const page = await context.newPage();
    await page.goto('http://localhost:3000/home');
    await expect(page.locator('html')).toHaveCSS('background-color', 'rgb(0, 0, 0)');
    await expect(page.locator('meta[name="theme-color"]')).toHaveAttribute('content', '#000000');
  } finally {
    await context.close();
  }
});

test('monochrome palettes stay consistent across language changes', async ({ page, }) => {
  const hydrationErrors: string[] = [];
  page.on('console', (message) => {
    if (/hydrat|did not match|server rendered/i.test(message.text())) {
      hydrationErrors.push(message.text());
    }
  });
  await page.goto('/home');
  await expect(page.getByRole('heading', { level: 1, name: 'Learning platform', })).toBeVisible();
  await expect(page.locator('body')).toHaveCSS('background-color', 'rgb(0, 0, 0)');
  await expect(page.locator('header')).toHaveCSS('background-color', 'rgb(0, 0, 0)');
  await page.getByRole('button', { name: 'Toggle theme', }).click();
  await expect(page.locator('body')).toHaveCSS('background-color', 'rgb(255, 255, 255)');
  await expect(page.locator('header')).toHaveCSS('background-color', 'rgb(255, 255, 255)');
  await page.reload();
  await expect(page.getByTestId('DarkModeIcon')).toBeVisible();
  await expect(page.locator('body')).toHaveCSS('background-color', 'rgb(255, 255, 255)');
  await expect(page.locator('header')).toHaveCSS('background-color', 'rgb(255, 255, 255)');
  await page.getByRole('button', { name: 'Switch language', }).click();
  await expect(page.locator('html')).toHaveAttribute('lang', 'ru');
  await expect(page.locator('body')).toHaveCSS('background-color', 'rgb(255, 255, 255)');
  await page.getByRole('button', { name: 'Сменить тему', }).click();
  await expect(page.locator('body')).toHaveCSS('background-color', 'rgb(0, 0, 0)');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  expect(hydrationErrors).toEqual([]);
});

test('the catalog can recover from a failed request', async ({ page, }) => {
  await page.route((url) => url.pathname === '/api/courses', async (route) => {
    await route.fulfill({ status: 500, contentType: 'application/json', body: '{}', });
  }, { times: 1, });
  await page.goto('/courses');
  await expect(page.getByRole('main').getByRole('alert')).toContainText('The courses couldn’t load.');
  await page.getByRole('button', { name: 'Try again', }).click();
  await expect(page.getByRole('heading', { name: 'JavaScript Fundamentals', })).toBeVisible();
});

test('the skip link works and reduced motion keeps transitions quiet', async ({ page, }) => {
  await page.emulateMedia({ reducedMotion: 'reduce', });
  await page.goto('/home');
  await expect(page.getByRole('heading', { level: 1, name: 'Learning platform', })).toBeVisible();
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Skip to content', })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('main')).toBeFocused();
  const duration = await page.getByRole('link', { name: 'Browse courses', exact: true, }).evaluate(
    (element) => Number.parseFloat(getComputedStyle(element).transitionDuration)
  );
  expect(duration).toBeLessThanOrEqual(0.01);
});

test('the navigation drawer contains focus and Escape restores it', async ({ page, }) => {
  await page.goto('/home');
  const trigger = page.getByRole('button', { name: 'Toggle navigation', });
  await trigger.click();
  const drawer = page.getByRole('dialog', { name: 'Navigation', });
  await expect(drawer).toBeVisible();
  for (let index = 0; index < 12; index++) {
    await page.keyboard.press('Tab');
    await expect.poll(async () => await drawer.evaluate(
      (element) => element.contains(document.activeElement)
    )).toBe(true);
  }
  await page.keyboard.press('Escape');
  await expect(drawer).not.toBeVisible();
  await expect(trigger).toBeFocused();
});

test('lesson pagination and topic links keep URL navigation meaningful', async ({ page, }) => {
  await page.goto('/course/12/lesson/0');
  await expect(page.getByRole('link', { name: 'Previous lesson', })).toHaveCount(0);
  await page.getByRole('link', { name: 'Next lesson', }).click();
  await expect(page).toHaveURL(/\/course\/12\/lesson\/1$/);
  await page.getByRole('link', { name: 'Previous lesson', }).click();
  await expect(page).toHaveURL(/\/course\/12\/lesson\/0$/);
  await page.goto('/courses');
  await page.getByRole('navigation', { name: 'Course topics', })
    .getByRole('link', { name: 'TypeScript', exact: true, }).click();
  await expect(page).toHaveURL(/\/courses\?search=TypeScript$/);
  await expect(page.getByRole('heading', { name: 'Introduction to TypeScript', })).toBeVisible();
});

test('direct course and lesson links survive refresh', async ({ page, }) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/course/12');
  await expect(page.getByRole('heading', {
    name: 'Python Web Scraping', exact: true,
  })).toBeVisible();
  await page.getByRole('link', { name: 'Python Web Scraping (part 1)', }).click();
  await expect(page).toHaveURL(/\/course\/12\/lesson\/0$/);
  await expect(page.getByRole('heading', { name: 'Python Web Scraping. Lesson 1', })).toBeVisible();
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Python Web Scraping. Lesson 1', })).toBeVisible();
  await expect(page.locator('.tutor img')).toBeVisible();
  await expect.poll(async () => await page.locator('.tutor img').evaluate(
    (image: HTMLImageElement) => image.complete && image.naturalWidth > 0
  )).toBe(true);
  expect(errors).toEqual([]);
});

test('search results remain filtered after refreshing the page', async ({ page, }) => {
  await page.goto('/home');
  // The catalog appears after hydration; wait before editing the controlled search input.
  await expect(page.getByRole('heading', { name: 'JavaScript Fundamentals', })).toBeVisible();
  await page.getByRole('textbox', { name: 'Search courses', }).fill('JavaScript');
  await page.getByRole('button', { name: 'Search courses', }).click();
  await expect(page).toHaveURL(/\/courses\?search=JavaScript$/);
  await expect(page.getByText('JavaScript Fundamentals', { exact: true, })).toBeVisible();
  await expect(page.getByText('HTML and CSS Basics', { exact: true, })).toHaveCount(0);
  await page.goBack();
  await expect(page).toHaveURL(/\/home$/);
  await page.goForward();
  await expect(page).toHaveURL(/\/courses\?search=JavaScript$/);
  await expect(page.getByText('JavaScript Fundamentals', { exact: true, })).toBeVisible();
  await page.reload();
  await expect(page.getByText('JavaScript Fundamentals', { exact: true, })).toBeVisible();
  await expect(page.getByText('HTML and CSS Basics', { exact: true, })).toHaveCount(0);
  await page.goto('/courses?search=zzzznomatchzzzz');
  await expect(page.getByText('No courses found. Try another search.')).toBeVisible();
});

test('unknown course and legacy lesson links have useful recovery links', async ({ page, }) => {
  await page.goto('/course/9999');
  await expect(page.getByRole('heading', { name: 'Course not found', })).toBeVisible();
  const recoveryLink = page.getByRole('link', { name: 'Back to courses', });
  await expect(recoveryLink).toHaveAttribute('href', '/courses');
  await page.goto('/lesson/0');
  await expect(page.getByRole('heading', {
    name: 'Choose a course to open a lesson',
  })).toBeVisible();
});

for (const width of [320, 375]) {
  test(`mobile navigation and search work at ${width}px`, async ({ page, }) => {
    await page.setViewportSize({ width, height: 812, });
    await page.goto('/home');
    await expect(page.getByRole('button', { name: 'Toggle navigation', })).toBeVisible();
    await page.getByRole('textbox', { name: 'Search courses', }).fill('TypeScript');
    await page.getByRole('button', { name: 'Search courses', }).click();
    await expect(page.getByText('Introduction to TypeScript', { exact: true, })).toBeVisible();
    await page.getByRole('button', { name: 'Toggle navigation', }).click();
    await expect(page.getByRole('complementary', { name: 'Main navigation', })).toBeVisible();
    await page.getByRole('button', { name: 'Close navigation', }).click();
    await expect(page.getByRole('complementary', { name: 'Main navigation', })).toBeHidden();
    const fits = await page.locator('body').evaluate(
      (body) => body.scrollWidth <= window.innerWidth
    );
    expect(fits).toBe(true);
    if (width === 375) {
      await page.screenshot({ path: '.cache/screenshots/mobile.png', fullPage: true, });
    }
  });
}

test('language and theme controls work with localized course data', async ({ page, }) => {
  await page.goto('/course/12');
  await expect(page.getByRole('heading', {
    name: 'Python Web Scraping', exact: true,
  })).toBeVisible();
  await page.getByRole('button', { name: 'Switch language', }).click();
  await expect(page.getByRole('heading', {
    name: 'Веб-скрапинг с помощью Python', exact: true, level: 1,
  })).toBeVisible();
  await page.getByRole('button', { name: 'Сменить тему', }).click();
  await expect(page.locator('body')).not.toHaveClass(/dark/);
  await page.screenshot({ path: '.cache/screenshots/course-desktop.png', fullPage: true, });
  for (const language of ['ru', 'en']) {
    if (language === 'en') await page.getByRole('button', { name: 'Сменить язык', }).click();
    for (const [route, namespace, key] of [
      ['/about', 'about', 'why-choose-us'],
      ['/teachers', 'teachers', 'our-teachers'],
      ['/contacts', 'contacts', 'get in touch']
    ]) {
      await page.goto(route);
      // Next.js bundles the translations; verify the public copy and the rendered content directly.
      const response = await page.request.get(`/locales/${language}/${namespace}.json`);
      expect(response.status()).toBe(200);
      const messages: Record<string, string> = await response.json();
      await expect(page.locator('main').getByText(messages[key], { exact: true, })).toBeVisible();
    }
  }
});
