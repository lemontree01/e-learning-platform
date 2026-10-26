import { getApiLanguage } from './getApiLanguage';

test.each([
  ['en', 'eng'],
  ['en-US', 'eng'],
  ['eng', 'eng'],
  ['ru', 'rus'],
  ['ru-RU', 'rus'],
  ['rus', 'rus'],
  ['fr', 'eng']
])('maps %s to the API language %s', (input, expected) => {
  expect(getApiLanguage(input)).toBe(expected);
});
