import { expect, test } from '@playwright/test';

for (const expired of [false, true]) {
  test(`guest navigation has a clean console${expired ? ' with an expired session' : ''}`, async ({
    page, context, baseURL,
  }) => {
    if (expired) {
      await context.addCookies([{
        name: 'learning_session', value: 'a'.repeat(64), url: baseURL ?? 'http://localhost:3000',
      }]);
    }
    const messages: string[] = [];
    const failures: string[] = [];
    page.on('console', message => {
      if (['error', 'warning'].includes(message.type())) messages.push(message.text());
    });
    page.on('pageerror', error => messages.push(error.message));
    page.on('requestfailed', request => {
      // Full navigations cancel background Next.js prefetches without a console error.
      const error = request.failure()?.errorText ?? 'Network request failed';
      if (error !== 'net::ERR_ABORTED') {
        failures.push(`${error} ${new URL(request.url()).pathname}`);
      }
    });
    page.on('response', response => {
      if (response.status() >= 400) {
        failures.push(`${response.status()} ${new URL(response.url()).pathname}`);
      }
    });
    for (const path of ['/home', '/courses', '/login', '/register', '/profile']) {
      const session = page.waitForResponse(response =>
        new URL(response.url()).pathname === '/api/auth/session');
      await page.goto(path);
      const response = await session;
      expect(response.status()).toBe(200);
      expect(await response.json()).toEqual({ user: null, });
      await page.waitForLoadState('networkidle');
    }
    await page.reload();
    const heading = page.getByRole('heading', { name: 'Sign in to view your account.', });
    await expect(heading).toBeVisible();
    // Session discovery is optional; the protected endpoint still rejects guests.
    expect((await page.request.get('/api/auth/me')).status()).toBe(401);
    expect(messages).toEqual([]);
    expect(failures).toEqual([]);
  });
}

test('a learner can register, reload their profile, sign out and sign back in', async ({ page, }) => {
  const email = `learner-${Date.now()}@example.test`;
  const password = 'local-test-password-123';
  const errors: string[] = [];
  const consoleMessages: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => {
    if (['error', 'warning'].includes(message.type())) consoleMessages.push(message.text());
  });
  await page.goto('/register');
  await page.getByLabel('Name', { exact: true, }).fill('New Learner');
  await page.getByLabel('Email', { exact: true, }).fill(email);
  await page.getByLabel('Password', { exact: true, }).fill(password);
  await page.getByLabel('Confirm password', { exact: true, }).fill('different-password');
  await page.getByRole('button', { name: 'Create account', exact: true, }).click();
  await expect(page.getByRole('main').getByRole('alert'))
    .toHaveText('The passwords do not match.');
  await page.getByLabel('Confirm password', { exact: true, }).fill(password);
  await page.getByRole('button', { name: 'Create account', exact: true, }).click();
  await expect(page).toHaveURL(/\/profile$/);
  await expect(page.getByText(email, { exact: true, })).toBeVisible();
  const restored = page.waitForResponse(response =>
    new URL(response.url()).pathname === '/api/auth/session');
  await page.reload();
  expect((await restored).status()).toBe(200);
  await expect(page.getByRole('heading', { name: 'New Learner', exact: true, })).toBeVisible();
  await page.getByRole('button', { name: 'Sign out', exact: true, }).click();
  await expect(page.getByRole('heading', { name: 'Sign in to view your account.', })).toBeVisible();
  await page.getByRole('link', { name: 'Sign in', exact: true, }).last().click();
  expect(consoleMessages).toEqual([]);
  await page.getByLabel('Email', { exact: true, }).fill(email);
  await page.getByLabel('Password', { exact: true, }).fill('incorrect-password');
  await page.getByRole('button', { name: 'Sign in', exact: true, }).click();
  await expect(page.getByRole('main').getByRole('alert')).toHaveText('Invalid email or password.');
  await page.getByLabel('Password', { exact: true, }).fill(password);
  await page.getByRole('button', { name: 'Sign in', exact: true, }).click();
  await expect(page).toHaveURL(/\/profile$/);
  await expect(page.getByText(email, { exact: true, })).toBeVisible();
  expect(errors).toEqual([]);
});

test('the complete JavaScript course opens its lesson material and final project', async ({ page, }) => {
  await page.goto('/course/0/lesson/0');
  await expect(page.getByRole('heading', { name: 'Your first JavaScript program', exact: true, })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Practice', exact: true, })).toBeVisible();
  const example = page.locator('.code-playground').first();
  await expect(example.getByRole('textbox', { name: 'Code editor', })).toBeVisible();
  await example.locator('.playground-expected summary').click();
  await expect(example.getByLabel('Expected output')).toHaveText('Hello, learner!\n5');
  await page.goto('/course/0/lesson/9');
  await expect(page.getByRole('heading', { name: 'Final project: a course progress report', exact: true, })).toBeVisible();
});

for (const width of [320, 768, 1024, 1440]) {
  test(`registration fits a ${width}px viewport and supports keyboard input`, async ({ page, }) => {
    await page.setViewportSize({ width, height: 900, });
    await page.goto('/register');
    const name = page.getByLabel('Name', { exact: true, });
    await expect(name).toBeVisible();
    await name.focus();
    await page.keyboard.press('Tab');
    await expect(page.getByLabel('Email', { exact: true, })).toBeFocused();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  });
}
