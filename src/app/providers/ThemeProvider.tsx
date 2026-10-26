import { type ReactNode, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getThemeColor, themeActions } from '~/entities/Theme';
import { useAppDispatch } from './StoreProvider';
import { applyTheme } from '~/shared/lib/theme/applyTheme';
import { readStoredTheme, writeStoredTheme } from '~/shared/lib/theme/themeStorage';

export function ThemeProvider ({ children, }: { children: ReactNode }) {
  const color = useSelector(getThemeColor);
  const dispatch = useAppDispatch();
  const [restored, setRestored] = useState(false);

  // Match the server's initial render before restoring browser-only preferences.
  useEffect(() => {
    dispatch(themeActions.setThemeColor(readStoredTheme()));
    setRestored(true);
  }, [dispatch]);

  useEffect(() => {
    // Do not overwrite the saved palette (or the boot script's styles) during hydration.
    if (!restored) return;
    applyTheme(color);
    writeStoredTheme(color);
  }, [color, restored]);
  return <>{children}</>;
}
