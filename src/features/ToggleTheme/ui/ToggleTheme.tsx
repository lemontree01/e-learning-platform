import { type MouseEvent } from 'react';
import { flushSync } from 'react-dom';
import { DarkModeIcon, LightModeIcon } from '~/shared/ui/SvgIcon/SvgIcon';
import { IconButton } from '~/shared/ui/IconButton';
import { getThemeColor, themeActions } from '~/entities/Theme';
import { Color } from '~/shared/types/Color';
import { applyTheme } from '~/shared/lib/theme/applyTheme';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '~/app/providers/StoreProvider';
import { useTranslation } from 'react-i18next';

export const ToggleTheme = () => {
  const { t, } = useTranslation();
  const color = useSelector(getThemeColor);
  const dispatch = useAppDispatch();

  const toggleTheme = (event: MouseEvent<HTMLButtonElement>) => {
    const next = color === Color.LIGHT ? Color.DARK : Color.LIGHT;
    // Apply directly as well: the provider's effect would land after the snapshot is taken.
    const update = () => {
      applyTheme(next);
      flushSync(() => { dispatch(themeActions.setThemeColor(next)); });
    };
    if (!('startViewTransition' in document) ||
      matchMedia('(prefers-reduced-motion: reduce)').matches) {
      update();
      return;
    }
    // The new palette grows as a circle from the button until it covers the farthest corner.
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = bounds.left + bounds.width / 2;
    const y = bounds.top + bounds.height / 2;
    const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    const root = document.documentElement;
    root.classList.add('theme-wipe');
    const transition = document.startViewTransition(update);
    transition.ready.then(() => {
      root.animate(
        { clipPath: [`circle(0 at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`], },
        {
          duration: 520,
          easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)',
          pseudoElement: '::view-transition-new(root)',
        }
      );
    }).catch(() => undefined);
    transition.finished.finally(() => { root.classList.remove('theme-wipe'); });
  };

  return (
    <IconButton onClick={toggleTheme} aria-label={t('toggle-theme')} title={t('toggle-theme')}>
      {color === Color.LIGHT ? <DarkModeIcon /> : <LightModeIcon />}
    </IconButton>
  );
};
