import { getPageMetadata } from './pageMetadata';
import en from '../../../../public/locales/en/translation.json';
import ru from '../../../../public/locales/ru/translation.json';

const translate = (copy: typeof en) => (key: string) => copy[key as keyof typeof copy];

test('page titles identify the active route instead of repeating the homepage title', () => {
  const home = getPageMetadata('/home', translate(en));
  const courses = getPageMetadata('/courses', translate(en));
  expect(home.title).toBe(en['app-title']);
  expect(courses.title).toBe(`${en.courses} — ${en['brand-name']}`);
  expect(courses.title).not.toBe(home.title);
});

test('account descriptions and missing-page titles follow the selected language', () => {
  expect(getPageMetadata('/login', translate(ru))).toEqual({
    title: `${ru['account-sign-in']} — ${ru['brand-name']}`,
    description: ru['account-login-intro'],
  });
  expect(getPageMetadata('/not-a-page', translate(en)).title).toContain('Page not found');
});

test('nested course and teacher links retain the correct page identity', () => {
  expect(getPageMetadata('/course/0/lesson/2', translate(en)).title).toBe(
    `${en.lesson} — ${en['brand-name']}`
  );
  expect(getPageMetadata('/teachers/0', translate(en)).title).toBe(
    `${en.teachers} — ${en['brand-name']}`
  );
});

test.each(['en', 'ru'])('all route metadata is translated in %s', (language) => {
  for (const route of ['/home', '/courses', '/about', '/teachers', '/contacts',
    '/login', '/register', '/profile', '/course/0', '/course/0/lesson/0', '/missing']) {
    const metadata = getPageMetadata(route, translate(language === 'ru' ? ru : en));
    expect(metadata.title).not.toContain('undefined');
    expect(metadata.description).toBeTruthy();
  }
});
