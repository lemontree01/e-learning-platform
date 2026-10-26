import { expect, test } from '@playwright/test';

test('a learner can register, reload their profile, sign out and sign back in', async ({ page, }) => {
  const email = `learner-${Date.now()}@example.test`;
  const password = 'local-test-password-123';
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
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
  await page.reload();
  await expect(page.getByRole('heading', { name: 'New Learner', exact: true, })).toBeVisible();
  await page.getByRole('button', { name: 'Sign out', exact: true, }).click();
  await expect(page.getByRole('heading', { name: 'Sign in to view your account.', })).toBeVisible();
  await page.getByRole('link', { name: 'Sign in', exact: true, }).last().click();
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
  await page.getByRole('button', { name: 'Show expected output', exact: true, }).click();
  await expect(page.locator('.lesson-console-output')).toHaveText('Hello, learner!\n5');
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
