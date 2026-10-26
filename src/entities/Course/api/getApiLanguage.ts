export type ApiLanguage = 'eng' | 'rus';

export function getApiLanguage (language: string): ApiLanguage {
  const baseLanguage = language.toLowerCase().split('-')[0];
  return baseLanguage === 'ru' || baseLanguage === 'rus' ? 'rus' : 'eng';
}
