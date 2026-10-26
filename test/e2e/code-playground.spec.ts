import { expect, test, type Page } from '@playwright/test';

function playground (page: Page) {
  return page.locator('.code-playground').first();
}

async function openEditor (page: Page) {
  await page.goto('/course/0/lesson/0');
  await expect(playground(page).getByRole('button', { name: 'Try code', exact: true, })).toHaveCount(0);
  await expect(playground(page).getByRole('textbox', { name: 'Code editor', })).toBeVisible();
}

async function execute (page: Page, source: string, language = 'javascript') {
  await playground(page).getByRole('combobox', { name: 'Language', }).selectOption(language);
  await playground(page).getByRole('textbox', { name: 'Code editor', }).fill(source);
  await playground(page).getByRole('button', { name: 'Run code', exact: true, }).click();
  await expect(playground(page).getByRole('button', { name: 'Run code', exact: true, })).toBeEnabled({ timeout: 45000, });
  return playground(page).getByTestId('code-output');
}

test('lesson API owns alternate language starters and reset restores them', async ({ page, }) => {
  await page.route('**/api/courses/0/lessons/0?*', async route => {
    const response = await route.fetch();
    const lesson = await response.json();
    lesson.blocks[1].starters = { python: 'print("Starter from backend")\n', };
    await route.fulfill({ response, json: lesson, });
  });
  await openEditor(page);
  const editor = playground(page).getByRole('textbox', { name: 'Code editor', });
  await playground(page).getByRole('combobox', { name: 'Language', }).selectOption('python');
  await expect(editor.locator('.cm-line').first()).toHaveText('print("Starter from backend")');
  await editor.fill('print("Edited")');
  await playground(page).getByRole('button', { name: 'Reset code', }).click();
  await expect(editor.locator('.cm-line').first()).toHaveText('print("Starter from backend")');
});

test('JavaScript and Python execute edited code and input with a clean browser console', async ({ page, }) => {
  const errors: string[] = [];
  const pythonRequests: string[] = [];
  page.on('request', request => {
    if (/\/code-runtime\/(python|pyodide)/.test(request.url())) pythonRequests.push(request.url());
  });
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => {
    if (['error', 'warning'].includes(message.type())) errors.push(message.text());
  });
  await openEditor(page);
  await playground(page).locator('.playground-input summary').click();
  await playground(page).getByLabel('Input (one line per prompt)').fill('Ada');
  await expect(await execute(page, 'console.log("Hello", prompt());')).toHaveText('Hello Ada\n');
  expect(pythonRequests).toEqual([]);
  await expect(await execute(page, 'print("Hello", input())', 'python')).toHaveText('Hello Ada\n');
  expect(pythonRequests.length).toBeGreaterThan(0);
  await expect(await execute(page, 'print("No newline", end="")', 'python')).toHaveText('No newline');
  await expect(playground(page).getByRole('status').filter({ hasText: 'Finished', })).toBeVisible();
  expect(errors).toEqual([]);
});

test('JavaScript has no DOM, storage, native messaging or networking capabilities', async ({ page, }) => {
  await openEditor(page);
  const output = await execute(page, `console.log(typeof window, typeof document, typeof fetch,
    typeof localStorage, typeof postMessage, typeof Worker, typeof XMLHttpRequest);
    console.log(Function("return typeof fetch")());`);
  await expect(output).toContainText('undefined undefined undefined undefined undefined undefined undefined');
  await expect(output).toContainText('\nundefined');
});

test('Python cannot recover native parent messaging, nested workers or app network access', async ({ page, }) => {
  const forbidden: string[] = [];
  await page.route('**/forbidden-probe**', async route => {
    forbidden.push(route.request().url());
    await route.abort();
  });
  await openEditor(page);
  const output = await execute(page, `import pyodide_js
host = pyodide_js.runPython.constructor("return globalThis")()
print(host.postMessage, host.Worker, host.reportError)
print(host.location.origin)
try:
    host.fetch("http://localhost:3300/forbidden-probe")
except Exception:
    print("network denied")
`, 'python');
  await expect(output).not.toContainText('Preparing');
  expect(forbidden).toEqual([]);
  await expect(output).toContainText('None None None\nnull');
});

test('Python host interop cannot bypass captured output primitives or flood application errors', async ({ page, }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => {
    if (['error', 'warning'].includes(message.type())) errors.push(message.text());
  });
  await openEditor(page);
  const output = await execute(page, `import pyodide_js
host = pyodide_js.runPython.constructor("return globalThis")()
host.eval("String.prototype.slice = () => 'x'.repeat(1000000)")
host.eval("for(let i=0;i<1000;i++) Promise.resolve().then(() => { throw new Error('blocked'); })")
print("safe output")
`, 'python');
  await expect(output).toHaveText('safe output\n');
  expect(errors).toEqual([]);
});

test('infinite loops stop and subsequent runs work; Stop and Reset remain usable', async ({ page, }) => {
  await openEditor(page);
  await execute(page, 'while (true) {}');
  await expect(playground(page).getByRole('status').filter({ hasText: /Program error|Stopped after/, })).toBeVisible();
  await expect(await execute(page, 'console.log(42)')).toHaveText('42\n');
  await playground(page).getByRole('combobox', { name: 'Language', }).selectOption('python');
  await playground(page).getByRole('textbox', { name: 'Code editor', }).fill('while True: pass');
  await playground(page).getByRole('button', { name: 'Run code', exact: true, }).click();
  await expect(playground(page).getByRole('status').filter({ hasText: 'Running…', })).toBeVisible({ timeout: 30000, });
  await playground(page).getByRole('button', { name: 'Stop', exact: true, }).click();
  await expect(playground(page).getByRole('status').filter({ hasText: 'Stopped', })).toBeVisible();
  await playground(page).getByRole('button', { name: 'Reset code', }).click();
  await expect(playground(page).getByRole('textbox', { name: 'Code editor', })).toContainText('Hello, learner!');
});

test('output floods are bounded in both languages', async ({ page, }) => {
  await openEditor(page);
  for (const [language, source] of [
    ['javascript', 'for(let i=0;i<100000;i++) console.log("x".repeat(1000));'],
    ['python', 'for i in range(100000):\n    print("x" * 1000)']
  ]) {
    const output = await execute(page, source, language);
    await expect(playground(page).getByRole('status').filter({ hasText: 'Output limit reached', })).toBeVisible();
    expect((await output.innerText()).length).toBeLessThanOrEqual(16384);
  }
});

test('multiline errors and invalid UTF-8 cannot bypass output limits', async ({ page, }) => {
  await openEditor(page);
  const error = await execute(page, 'throw new Error("\\n".repeat(300))');
  await expect(playground(page).getByRole('status').filter({ hasText: 'Output limit reached', })).toBeVisible();
  expect((await error.innerText()).split('\n').length).toBeLessThanOrEqual(201);
  const bytes = await execute(page, 'import sys\nsys.stdout.buffer.write(b"\\xff" * 16000)', 'python');
  await expect(playground(page).getByRole('status').filter({ hasText: 'Output limit reached', })).toBeVisible();
  expect(new TextEncoder().encode(await bytes.innerText()).length).toBeLessThanOrEqual(16384);
});

test('editor fits mobile and supports light theme and Russian labels', async ({ page, }) => {
  await page.setViewportSize({ width: 375, height: 900, });
  await openEditor(page);
  await expect(await execute(page, 'console.log(42)')).toHaveText('42\n');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.getByRole('button', { name: 'Toggle theme', }).click();
  await page.screenshot({ path: '.cache/screenshots/code-playground-mobile.png', fullPage: true, });
  await page.getByRole('button', { name: 'Switch language', }).click();
  await expect(playground(page).getByRole('button', { name: 'Запустить код', exact: true, })).toBeVisible();
});

test('default editor has distinct syntax colors, compact reference output and responsive controls', async ({ page, }) => {
  await page.setViewportSize({ width: 1440, height: 1100, });
  await page.goto('/course/0/lesson/1');
  const panel = playground(page);
  const editor = panel.getByRole('textbox', { name: 'Code editor', });
  await expect(editor).toBeVisible();
  await expect(page.getByRole('button', { name: 'Try code', exact: true, })).toHaveCount(0);
  await expect(panel.locator('.playground-expected')).not.toHaveAttribute('open');
  await expect(panel.locator('.playground-input')).not.toHaveAttribute('open');
  const source = '// A greeting\nconst greeting = "Hello";\n' +
    'function greet(name) { return greeting + name + 42; }\nconsole.log(greet("Ada"));';
  await editor.fill(source);
  const syntaxColors = await editor.locator('span').evaluateAll(spans =>
    [...new Set(spans.map(span => getComputedStyle(span).color))]);
  expect(syntaxColors.length).toBeGreaterThanOrEqual(6);
  const select = panel.getByRole('combobox', { name: 'Language', });
  await select.focus();
  await page.keyboard.press('Tab');
  await expect(panel.getByRole('button', { name: 'Copy code', })).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(editor).toBeFocused();
  await panel.getByRole('button', { name: 'Run code', exact: true, }).click();
  await expect(panel.getByTestId('code-output')).toHaveText('HelloAda42\n');
  await panel.locator('.playground-expected summary').click();
  await expect(panel.getByLabel('Expected output')).toBeVisible();
  await panel.screenshot({ path: '.cache/screenshots/code-panel-desktop-dark.png', });
  await page.getByRole('button', { name: 'Toggle theme', }).click();
  await panel.screenshot({ path: '.cache/screenshots/code-panel-desktop-light.png', });
  for (const width of [320, 375, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 1100, });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await expect(panel.getByRole('button', { name: 'Run code', exact: true, })).toBeVisible();
    if (width === 375) {
      await panel.screenshot({ path: '.cache/screenshots/code-panel-mobile-light.png', });
    }
  }
  await page.getByRole('button', { name: 'Switch language', }).click();
  await expect(panel.getByText('Интерактивный пример', { exact: true, })).toBeVisible();
  await page.setViewportSize({ width: 375, height: 1100, });
  await panel.screenshot({ path: '.cache/screenshots/code-panel-mobile-ru.png', });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('lesson navigation restores each example instead of carrying edited code forward', async ({ page, }) => {
  await page.goto('/course/0/lesson/1');
  const editor = playground(page).getByRole('textbox', { name: 'Code editor', });
  await editor.fill('console.log("edited example")');
  await page.getByRole('link', { name: 'Next lesson', exact: true, }).first().click();
  await expect(page).toHaveURL(/\/course\/0\/lesson\/2$/);
  await expect(editor).toBeVisible();
  await expect(editor).not.toContainText('edited example');
  await page.goBack();
  await expect(page).toHaveURL(/\/course\/0\/lesson\/1$/);
  await expect(editor).toContainText('lessonCount');
});
