import { Color } from '~/shared/types/Color';
import { themes } from '~/shared/config/themes';
import { applyTheme } from './applyTheme';

test('switching themes updates every configured token and the browser color scheme', () => {
  const meta = document.createElement('meta');
  meta.name = 'theme-color';
  document.head.append(meta);

  for (const color of [Color.DARK, Color.LIGHT, Color.DARK]) {
    applyTheme(color);
    const theme = themes[color];
    for (const [token, value] of Object.entries(theme.colors)) {
      expect(document.documentElement.style.getPropertyValue(`--${token}`)).toBe(value);
    }
    expect(document.documentElement.style.colorScheme).toBe(theme.colorScheme);
    expect(document.body.classList.contains('dark')).toBe(color === Color.DARK);
    expect(meta.content).toBe(color === Color.DARK ? '#000000' : '#ffffff');
  }
  meta.remove();
});
