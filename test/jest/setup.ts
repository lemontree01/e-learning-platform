import '@testing-library/jest-dom';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from '../../public/locales/en.json';
import ru from '../../public/locales/ru.json';

void i18n.use(initReactI18next).init({
  lng: 'en',
  fallbackLng: 'en',
  defaultNS: 'translation',
  ns: Object.keys(en),
  resources: { en, ru, },
  interpolation: { escapeValue: false, },
});
