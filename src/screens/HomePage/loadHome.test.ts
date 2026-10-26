import { loadHome } from './loadHome';

const course = {
  id: 0,
  name: 'JavaScript',
  author: 'A',
  date: '2024-01-01',
  numberOfLessons: 2,
  lessons: [{ title: 'One', }],
};
const other = {
  id: 1, name: 'Python', author: 'B', date: '2024-01-02', numberOfLessons: 1,
};

beforeEach(() => {
  process.env.SERVER_URL = 'http://api.test';
});

test('reads the catalog and featured course in one server pass', async () => {
  global.fetch = jest.fn(async (url: string) => ({
    ok: true,
    json: async () => String(url).includes('/courses/0')
      ? course
      : [other, { bad: true, }, course],
  })) as typeof fetch;

  await expect(loadHome('en')).resolves.toEqual({
    language: 'eng',
    courses: [other, course],
    course,
  });
  expect(global.fetch).toHaveBeenCalledTimes(2);
});

test('lets the browser load the page when the API is down', async () => {
  global.fetch = jest.fn(async () => {
    throw new Error('down');
  }) as typeof fetch;

  await expect(loadHome('ru')).resolves.toEqual({
    language: 'rus', courses: null, course: null,
  });
});
