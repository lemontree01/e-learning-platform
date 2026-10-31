import { DEFAULT_THEME, themes } from '../../config/themes';
import { Color } from '../../types/Color';
import { THEME_STORAGE_KEY } from './themeStorage';

const initialTheme = themes[DEFAULT_THEME];

export function initialThemeStyle (): Record<string, string> {
  const style: Record<string, string> = {};
  for (const [token, value] of Object.entries(initialTheme.colors)) {
    style[`--${token}`] = value;
  }
  style.colorScheme = initialTheme.colorScheme;
  style.background = 'var(--page)';
  style.color = 'var(--ink)';
  return style;
}

export function themeBootScript (): string {
  return `(function(){try{var themes=${JSON.stringify(themes)};` +
    // No saved choice: follow the system setting, like readStoredTheme.
    `var color=localStorage.getItem(${JSON.stringify(THEME_STORAGE_KEY)})||` +
    `(matchMedia('(prefers-color-scheme: light)').matches?${JSON.stringify(Color.LIGHT)}:'');` +
    'var theme=themes[color];if(!theme)return;var root=document.documentElement;' +
    'for(var token in theme.colors){if(Object.prototype.hasOwnProperty.call(theme.colors,token))' +
    "root.style.setProperty('--'+token,theme.colors[token]);}" +
    'root.style.colorScheme=theme.colorScheme;root.dataset.theme=theme.colorScheme;' +
    'var meta=document.querySelector(\'meta[name="theme-color"]\');' +
    "if(meta)meta.setAttribute('content',theme.colors.page);}catch(e){}})();";
}

export const initialThemeColor = initialTheme.colors.page;
