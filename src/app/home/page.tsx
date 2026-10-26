import { cookies } from 'next/headers';
import HomePage from '~/screens/HomePage/ui/HomePage';
import { loadHome } from '~/screens/HomePage/loadHome';
import { LANGUAGE_COOKIE, normalizeLanguage } from '~/shared/config/language';

export default async function Page () {
  const saved = (await cookies()).get(LANGUAGE_COOKIE)?.value;
  return <HomePage seed={await loadHome(normalizeLanguage(saved))} />;
}
