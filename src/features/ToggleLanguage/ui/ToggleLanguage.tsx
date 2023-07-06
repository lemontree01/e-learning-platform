import TranslateIcon from '@mui/icons-material/Translate';
import { useTranslation } from 'react-i18next';
import { IconButton } from '~/shared/ui/IconButton';

export const ToggleLanguage = () => {
  const { i18n, } = useTranslation();

  const toggle = async () => {
    i18n.changeLanguage(i18n.language === 'ru' ? 'en' : 'ru');
  };
  return (
      <IconButton onClick={toggle}>
        <TranslateIcon />
      </IconButton>
  );
};
