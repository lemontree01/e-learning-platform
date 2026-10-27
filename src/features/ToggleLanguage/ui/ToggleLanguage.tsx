import { TranslateIcon } from '~/shared/ui/SvgIcon/SvgIcon';
import { useTranslation } from 'react-i18next';
import { IconButton } from '~/shared/ui/IconButton';
import { normalizeLanguage, persistLanguage } from '~/shared/config/language';

export const ToggleLanguage = () => {
  const { t, i18n, } = useTranslation();

  const toggle = () => {
    const next = normalizeLanguage(i18n.resolvedLanguage) === 'ru' ? 'en' : 'ru';
    persistLanguage(next);
    void i18n.changeLanguage(next);
  };
  return (
      <IconButton onClick={toggle} aria-label={t('switch-language')} title={t('switch-language')}>
        <TranslateIcon />
      </IconButton>
  );
};
