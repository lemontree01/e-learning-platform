import { routeMetadata } from './routeMetadata';
import { siteUrl } from './siteUrl';
import enMessages from '../../../../public/locales/en.json';
import ruMessages from '../../../../public/locales/ru.json';

const en = enMessages.translation;
const ru = ruMessages.translation;

let mockLanguage = 'en';
jest.mock('next/headers', () => ({
  cookies: async () => ({ get: () => ({ value: mockLanguage, }), }),
}));

afterEach(() => { mockLanguage = 'en'; });

test('canonical and sharing metadata identify the actual nested route', async () => {
  const metadata = await routeMetadata('/course/3/lesson/2');
  const url = new URL('/course/3/lesson/2', siteUrl).href;
  expect(metadata.alternates?.canonical).toBe(url);
  expect(metadata.openGraph).toMatchObject({
    url, title: `${en.lesson} — ${en['brand-name']}`, locale: 'en_US', type: 'website',
  });
  expect(metadata.twitter).toMatchObject({ card: 'summary', title: metadata.title, });
});

test('sharing metadata is translated using the request language', async () => {
  mockLanguage = 'ru';
  const metadata = await routeMetadata('/courses');
  expect(metadata.openGraph).toMatchObject({
    title: `${ru.courses} — ${ru['brand-name']}`,
    locale: 'ru_RU',
    description: ru['library-description'],
  });
});

test.each(['/login', '/register', '/profile', '/lesson/1'])(
  '%s is excluded from indexing', async (pathname) => {
    expect((await routeMetadata(pathname)).robots).toMatchObject({ index: false, });
  }
);
