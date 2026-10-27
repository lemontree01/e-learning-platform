import { createAppI18n } from './i18n';

test('simultaneous app renders keep their own language and translations', async () => {
  const english = createAppI18n('en');
  const russian = createAppI18n('ru');
  expect(english.resolvedLanguage).toBe('en');
  expect(russian.resolvedLanguage).toBe('ru');
  expect(english.t('home')).toBe('Home');
  expect(russian.t('home')).not.toBe('Home');
  await russian.changeLanguage('en');
  await english.changeLanguage('ru');
  expect(russian.t('home')).toBe('Home');
  expect(english.t('home')).not.toBe('Home');
});
