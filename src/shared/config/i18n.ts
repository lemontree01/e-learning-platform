import { createInstance } from 'i18next';
import en from '../../../public/locales/en.json';
import ru from '../../../public/locales/ru.json';
import { type AppLanguage } from './language';

const namespaces = Object.keys(en);

// Each rendered app owns its language. A module singleton can leak language
// changes between concurrent server requests.
export function createAppI18n (language: AppLanguage) {
  const instance = createInstance();
  void instance.init({
    lng: language,
    initImmediate: false,
    fallbackLng: 'en',
    supportedLngs: ['en', 'ru'],
    nonExplicitSupportedLngs: true,
    load: 'languageOnly',
    ns: namespaces,
    defaultNS: 'translation',
    resources: { en, ru, },
    react: { useSuspense: false, },
    debug: false,
    interpolation: {
      escapeValue: false,
    },
  });
  return instance;
}
