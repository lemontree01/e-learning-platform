export const LANGUAGE_COOKIE = 'lang';
export type AppLanguage = 'en' | 'ru';

export function normalizeLanguage (value: string | null | undefined): AppLanguage {
  return value?.toLowerCase().split('-')[0] === 'ru' ? 'ru' : 'en';
}

export function persistLanguage (language: AppLanguage) {
  document.cookie = `${LANGUAGE_COOKIE}=${language};path=/;max-age=31536000;samesite=lax`;
}
