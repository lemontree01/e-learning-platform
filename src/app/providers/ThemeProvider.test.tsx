import { fireEvent, render, screen } from '@testing-library/react';
import { renderToString } from 'react-dom/server.node';
import { StoreProvider } from './StoreProvider/ui/StoreProvider';
import { ThemeProvider } from './ThemeProvider';
import { ToggleTheme } from '~/features/ToggleTheme';
import { Color } from '~/shared/types/Color';
import { THEME_STORAGE_KEY } from '~/shared/lib/theme/themeStorage';

const tree = () => <StoreProvider><ThemeProvider><ToggleTheme /></ThemeProvider></StoreProvider>;

beforeEach(() => { localStorage.clear(); });

test('the selected palette survives parent rerenders', () => {
  const view = render(tree());
  expect(document.documentElement.style.getPropertyValue('--page')).toBe('#000000');
  fireEvent.click(screen.getByRole('button', { name: 'Toggle theme', }));
  expect(document.documentElement.style.getPropertyValue('--page')).toBe('#ffffff');
  expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe(Color.LIGHT);
  view.rerender(tree());
  expect(document.documentElement.style.getPropertyValue('--page')).toBe('#ffffff');
});

test('a saved palette is restored on the next visit', () => {
  localStorage.setItem(THEME_STORAGE_KEY, Color.LIGHT);
  render(tree());
  expect(document.documentElement.style.getPropertyValue('--page')).toBe('#ffffff');
});

test('an unknown saved palette falls back to the default', () => {
  localStorage.setItem(THEME_STORAGE_KEY, 'blue');
  render(tree());
  expect(document.documentElement.style.getPropertyValue('--page')).toBe('#000000');
});

test.each([Color.LIGHT, Color.DARK])('hydrates saved %s without mismatched icons', (saved) => {
  const error = jest.spyOn(console, 'error').mockImplementation(() => {});
  try {
    // The server has no localStorage preference.
    const container = document.createElement('div');
    container.innerHTML = renderToString(<StoreProvider><ToggleTheme /></StoreProvider>);
    document.body.appendChild(container);
    localStorage.setItem(THEME_STORAGE_KEY, saved);
    // React Redux warns about layout effects when SSR is simulated inside jsdom.
    for (const [message] of error.mock.calls) {
      expect(message).toContain('useLayoutEffect does nothing on the server');
    }
    error.mockClear();
    render(tree(), { container, hydrate: true, });
    expect(error).not.toHaveBeenCalled();
    expect(screen.getByTestId(saved === Color.LIGHT ? 'DarkModeIcon' : 'LightModeIcon'))
      .toBeInTheDocument();
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe(saved);
    fireEvent.click(screen.getByRole('button', { name: 'Toggle theme', }));
    expect(localStorage.getItem(THEME_STORAGE_KEY))
      .toBe(saved === Color.LIGHT ? Color.DARK : Color.LIGHT);
  } finally {
    error.mockRestore();
  }
});
