import { cookies } from 'next/headers';
import { type Metadata } from 'next';
import { LANGUAGE_COOKIE, normalizeLanguage } from '~/shared/config/language';
import { getPageMetadata } from './pageMetadata';
import en from '../../../../public/locales/en/translation.json';
import ru from '../../../../public/locales/ru/translation.json';

export async function routeMetadata (pathname: string): Promise<Metadata> {
  const language = normalizeLanguage((await cookies()).get(LANGUAGE_COOKIE)?.value);
  const copy = language === 'ru' ? ru : en;
  return {
    ...getPageMetadata(pathname, (key) => copy[key as keyof typeof copy]),
    ...(['/login', '/register', '/profile'].includes(pathname)
      ? { robots: { index: false, follow: true, }, }
      : {}),
  };
}
