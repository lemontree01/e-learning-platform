import { cookies } from 'next/headers';
import { type Metadata } from 'next';
import { LANGUAGE_COOKIE, normalizeLanguage } from '~/shared/config/language';
import { getPageMetadata } from './pageMetadata';
import enMessages from '../../../../public/locales/en.json';
import ruMessages from '../../../../public/locales/ru.json';
import { siteUrl } from './siteUrl';

const en = enMessages.translation;
const ru = ruMessages.translation;

// `title` replaces the route's generic page name, e.g. with a course name.
export async function routeMetadata (
  pathname: string, { missing = false, title, }: { missing?: boolean; title?: string } = {}
): Promise<Metadata> {
  const language = normalizeLanguage((await cookies()).get(LANGUAGE_COOKIE)?.value);
  const copy = language === 'ru' ? ru : en;
  const metadata = getPageMetadata(pathname, (key) => copy[key as keyof typeof copy] as string);
  if (title) metadata.title = `${title} — ${copy['brand-name']}`;
  const canonical = missing ? null : new URL(pathname, siteUrl).href;
  const noIndex = ['/login', '/register', '/profile'].includes(pathname) ||
    pathname.startsWith('/lesson/');
  return {
    ...metadata,
    metadataBase: siteUrl,
    alternates: { canonical, },
    openGraph: {
      ...metadata,
      siteName: copy['brand-name'],
      type: 'website',
      locale: language === 'ru' ? 'ru_RU' : 'en_US',
      ...(canonical ? { url: canonical, } : {}),
    },
    twitter: { ...metadata, card: 'summary', },
    ...(noIndex
      ? { robots: { index: false, follow: true, }, }
      : {}),
  };
}
