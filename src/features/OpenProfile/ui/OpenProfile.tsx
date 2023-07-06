import { IconButton } from '~/shared/ui/IconButton';
import PersonIcon from '@mui/icons-material/Person';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '~/state';
import { getIsUserShown, themeActions } from '~/entities/Theme';

export const OpenProfile = () => {
  const isUserShown = useSelector(getIsUserShown);
  const dispatch = useAppDispatch();

  const toggleProfile = () => {
    dispatch(themeActions.setIsUserShown(!isUserShown));
  };

  return (
    <IconButton onClick={toggleProfile}>
      <PersonIcon />
    </IconButton>
  );
};
