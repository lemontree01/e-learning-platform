import { MenuIcon } from '~/shared/ui/SvgIcon/SvgIcon';
import { IconButton } from '~/shared/ui/IconButton';
import { useSelector } from 'react-redux';
import { getIsSidebarShown, themeActions } from '~/entities/Theme';
import { useAppDispatch } from '~/app/providers/StoreProvider';
import { useTranslation } from 'react-i18next';

export const ToggleSidebar = () => {
  const { t, } = useTranslation();
  const isSidebarShown = useSelector(getIsSidebarShown);
  const dispatch = useAppDispatch();

  const toggleIsSidebarShown = () => {
    dispatch(themeActions.setIsSidebarShown(!isSidebarShown));
  };

  return (
    <IconButton onClick={toggleIsSidebarShown} aria-label={t('toggle-navigation')}
      title={t('toggle-navigation')}
      aria-expanded={isSidebarShown} aria-controls='main-navigation'>
      <MenuIcon />
    </IconButton>
  );
};
