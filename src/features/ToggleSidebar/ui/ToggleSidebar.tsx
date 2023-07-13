import { IconButton } from '~/shared/ui/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { useSelector } from 'react-redux';
import { getIsSidebarShown, themeActions } from '~/entities/Theme';
import { useAppDispatch } from '~/app/providers/StoreProvider';

export const ToggleSidebar = () => {
  const isSidebarShown = useSelector(getIsSidebarShown);
  const dispatch = useAppDispatch();

  const toggleIsSidebarShown = () => {
    dispatch(themeActions.setIsSidebarShown(!isSidebarShown));
  };

  return (
    <IconButton onClick={toggleIsSidebarShown}>
      <MenuIcon />
    </IconButton>
  );
};
