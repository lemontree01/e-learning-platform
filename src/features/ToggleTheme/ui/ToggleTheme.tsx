import { IconButton } from '~/shared/ui/IconButton';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import { getThemeColor, themeActions } from '~/entities/Theme';
import { useAppDispatch } from '~/state';
import { Color } from '~/shared/types/Color';
import { useSelector } from 'react-redux';

export const ToggleTheme = () => {
  const color = useSelector(getThemeColor);
  const dispatch = useAppDispatch();

  const toggleTheme = () => {
    dispatch(themeActions.setThemeColor(
      color === Color.LIGHT ? Color.DARK : Color.LIGHT));
  };

  if (color === Color.DARK) {
    document.body.classList.add('dark');
  } else {
    document.body.classList.remove('dark');
  }
  return (
    <IconButton onClick={toggleTheme}>
      {color === Color.LIGHT ? <DarkModeIcon /> : <LightModeIcon />}
    </IconButton>
  );
};
