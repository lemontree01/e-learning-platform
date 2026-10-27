import { DarkModeIcon, LightModeIcon } from '~/shared/ui/SvgIcon/SvgIcon';
import { IconButton } from '~/shared/ui/IconButton';
import { getThemeColor, themeActions } from '~/entities/Theme';
import { Color } from '~/shared/types/Color';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '~/app/providers/StoreProvider';
import { useTranslation } from 'react-i18next';

export const ToggleTheme = () => {
  const { t, } = useTranslation();
  const color = useSelector(getThemeColor);
  const dispatch = useAppDispatch();

  const toggleTheme = () => {
    dispatch(themeActions.setThemeColor(
      color === Color.LIGHT ? Color.DARK : Color.LIGHT));
  };

  return (
    <IconButton onClick={toggleTheme} aria-label={t('toggle-theme')} title={t('toggle-theme')}>
      {color === Color.LIGHT ? <DarkModeIcon /> : <LightModeIcon />}
    </IconButton>
  );
};
