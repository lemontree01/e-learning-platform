import { DEFAULT_THEME } from '../../config/themes';
import { Color } from '../../types/Color';

export const THEME_STORAGE_KEY = 'theme';

export function readStoredTheme (): Color {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === Color.LIGHT || stored === Color.DARK) return stored;
  } catch {
    // localStorage throws in private mode and some embedded browsers.
  }
  return DEFAULT_THEME;
}

export function writeStoredTheme (color: Color) {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, color);
  } catch {
    // localStorage throws in private mode and some embedded browsers.
  }
}
