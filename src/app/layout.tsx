import { type ReactNode } from 'react';
import { cookies } from 'next/headers';
import { App } from './App';
import { LANGUAGE_COOKIE, normalizeLanguage } from '~/shared/config/language';
import { routeMetadata } from '~/shared/lib/metadata/routeMetadata';
import {
  initialThemeColor, initialThemeStyle, themeBootScript
} from '~/shared/lib/theme/themeBoot';
import './styles/app.scss';
import '@fontsource-variable/manrope';
import '@fontsource/ibm-plex-mono/400.css';
import sansLatin from '@fontsource-variable/manrope/files/manrope-latin-wght-normal.woff2';
import sansCyrillic from '@fontsource-variable/manrope/files/manrope-cyrillic-wght-normal.woff2';
import monoLatin from '@fontsource/ibm-plex-mono/files/ibm-plex-mono-latin-400-normal.woff2';
import monoCyrillic from '@fontsource/ibm-plex-mono/files/ibm-plex-mono-cyrillic-400-normal.woff2';

export async function generateMetadata () {
  return {
    ...await routeMetadata('/home'),
    icons: { icon: '/favicon.svg', },
  };
}

export default async function RootLayout ({ children, }: { children: ReactNode }) {
  const saved = (await cookies()).get(LANGUAGE_COOKIE)?.value;
  const lang = normalizeLanguage(saved);
  const fonts = lang === 'ru'
    ? [sansLatin, sansCyrillic, monoLatin, monoCyrillic]
    : [sansLatin, monoLatin];
  return (
    <html lang={lang} style={initialThemeStyle()} suppressHydrationWarning>
      <head>
        {fonts.map(font => <link key={font} rel='preload' href={font}
          as='font' type='font/woff2' crossOrigin='anonymous' />)}
        <meta name='theme-color' content={initialThemeColor} />
        <script dangerouslySetInnerHTML={{ __html: themeBootScript(), }} />
      </head>
      <body>
        <App language={lang}>{children}</App>
      </body>
    </html>
  );
}
