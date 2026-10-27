import { createInstance } from 'i18next';
import enTranslation from '../../../public/locales/en/translation.json';
import enAbout from '../../../public/locales/en/about.json';
import enContacts from '../../../public/locales/en/contacts.json';
import enTeachers from '../../../public/locales/en/teachers.json';
import enObservatory from '../../../public/locales/en/observatory.json';
import ruTranslation from '../../../public/locales/ru/translation.json';
import ruAbout from '../../../public/locales/ru/about.json';
import ruContacts from '../../../public/locales/ru/contacts.json';
import ruTeachers from '../../../public/locales/ru/teachers.json';
import ruObservatory from '../../../public/locales/ru/observatory.json';
import { type AppLanguage } from './language';

const namespaces = ['translation', 'about', 'contacts', 'teachers', 'observatory'];

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
    resources: {
      en: {
        translation: enTranslation,
        about: enAbout,
        contacts: enContacts,
        teachers: enTeachers,
        observatory: enObservatory,
      },
      ru: {
        translation: ruTranslation,
        about: ruAbout,
        contacts: ruContacts,
        teachers: ruTeachers,
        observatory: ruObservatory,
      },
    },
    react: { useSuspense: false, },
    debug: false,
    interpolation: {
      escapeValue: false,
    },
  });
  return instance;
}
