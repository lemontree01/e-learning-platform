import '@testing-library/jest-dom';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

void i18n.use(initReactI18next).init({
  lng: 'en',
  fallbackLng: 'en',
  resources: {
    en: {
      translation: require('../../public/locales/en/translation.json'),
      observatory: require('../../public/locales/en/observatory.json'),
    },
  },
  interpolation: { escapeValue: false, },
});
