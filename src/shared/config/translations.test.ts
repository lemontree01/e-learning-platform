import { createInstance } from 'i18next';

test.each([
  [1, '1 урок'], [2, '2 урока'], [5, '5 уроков'], [21, '21 урок']
])('Russian lesson counts use the correct form for %i', async (count, expected) => {
  const i18n = createInstance();
  await i18n.init({
    lng: 'ru',
    resources: { ru: { translation: require('../../../public/locales/ru/translation.json'), }, },
  });
  expect(i18n.t('lesson-count', { count, })).toBe(expected);
});
