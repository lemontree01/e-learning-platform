import { themes } from '../../config/themes';
import { type Color } from '../../types/Color';

export function applyTheme (color: Color) {
  const theme = themes[color];
  const element = document.documentElement;
  for (const [token, value] of Object.entries(theme.colors)) {
    element.style.setProperty(`--${token}`, value);
  }
  element.style.colorScheme = theme.colorScheme;
  element.dataset.theme = theme.colorScheme;
  document.body.classList.toggle('dark', theme.colorScheme === 'dark');
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme.colors.page);
}
