import { type ReactNode } from 'react';
import { type Metadata } from 'next';
import { cookies } from 'next/headers';
import { App } from './App';
import { LANGUAGE_COOKIE, normalizeLanguage } from '~/shared/config/language';
import enTranslation from '../../public/locales/en/translation.json';
import ruTranslation from '../../public/locales/ru/translation.json';
import {
  initialThemeColor, initialThemeStyle, themeBootScript
} from '~/shared/lib/theme/themeBoot';
import './styles/app.scss';
import '@fontsource-variable/manrope';
import '@fontsource/ibm-plex-mono/400.css';

export async function generateMetadata (): Promise<Metadata> {
  const saved = (await cookies()).get(LANGUAGE_COOKIE)?.value;
  const copy = normalizeLanguage(saved) === 'ru' ? ruTranslation : enTranslation;
  return {
    title: copy['app-title'],
    description: copy['app-description'],
    icons: { icon: '/favicon.svg', },
  };
}

export default async function RootLayout ({ children, }: { children: ReactNode }) {
  const saved = (await cookies()).get(LANGUAGE_COOKIE)?.value;
  const lang = normalizeLanguage(saved);
  return (
    <html lang={lang} style={initialThemeStyle()} suppressHydrationWarning>
      <head>
        <meta name='theme-color' content={initialThemeColor} />
        <script dangerouslySetInnerHTML={{ __html: themeBootScript(), }} />
      </head>
      <body>
        <App language={lang}>{children}</App>
      </body>
    </html>
  );
}
