import sitemap from './sitemap';
import { siteUrl } from '~/shared/lib/metadata/siteUrl';

test('sitemap includes public routes and valid course chapters without duplicates', async () => {
  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: async () => [
      { id: 0, numberOfLessons: 2, }, { id: 3, numberOfLessons: 1, },
      { id: 0, numberOfLessons: 2, }, { id: -1, numberOfLessons: 2, },
      { id: 'https://untrusted.test', numberOfLessons: 1, },
      { id: 4, numberOfLessons: 1e9, }
    ],
  });
  const urls = (await sitemap()).map(entry => entry.url);
  expect(urls).toContain(new URL('/home', siteUrl).href);
  expect(urls).toContain(new URL('/course/0/lesson/1', siteUrl).href);
  expect(urls).toContain(new URL('/course/3', siteUrl).href);
  expect(new Set(urls).size).toBe(urls.length);
  for (const excluded of ['/course/-1', '/course/4', '/login', '/profile']) {
    expect(urls).not.toContain(new URL(excluded, siteUrl).href);
  }
  expect(urls.every(url => url.startsWith(siteUrl.origin + '/'))).toBe(true);
});

test('the public sitemap remains available while the course API is unavailable', async () => {
  global.fetch = jest.fn().mockRejectedValue(new Error('API unavailable'));
  expect((await sitemap()).map(entry => new URL(entry.url).pathname))
    .toEqual(['/home', '/courses', '/about', '/contacts']);
});

test('invalid catalog responses cannot generate URLs or break the static sitemap', async () => {
  global.fetch = jest.fn().mockResolvedValue({ ok: true, json: async () => ({ error: true, }), });
  expect(await sitemap()).toHaveLength(4);
});
