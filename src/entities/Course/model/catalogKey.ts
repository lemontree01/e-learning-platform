import { getApiLanguage } from '../api/getApiLanguage';

export function getCatalogKey (language: string, query = '') {
  return `${getApiLanguage(language)}:${query.trim()}`;
}
