import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
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
import { LANGUAGE_COOKIE } from './language';

const namespaces = ['translation', 'about', 'contacts', 'teachers', 'observatory'];

i18n.use(LanguageDetector)
  .use(initReactI18next)
  .init({
    initImmediate: false,
    fallbackLng: 'en',
    supportedLngs: ['en', 'ru'],
    nonExplicitSupportedLngs: true,
    load: 'languageOnly',
    detection: {
      order: ['cookie'],
      caches: ['cookie'],
      lookupCookie: LANGUAGE_COOKIE,
      cookieMinutes: 525600,
      cookieOptions: { path: '/', sameSite: 'lax', },
    },
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
    debug: process.env.NODE_ENV !== 'production',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
