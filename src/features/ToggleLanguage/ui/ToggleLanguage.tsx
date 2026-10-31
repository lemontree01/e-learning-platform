import { TranslateIcon } from '~/shared/ui/SvgIcon/SvgIcon';
import { useTranslation } from 'react-i18next';
import { IconButton } from '~/shared/ui/IconButton';
import { normalizeLanguage, persistLanguage } from '~/shared/config/language';
import { useRouter } from 'next/navigation';

export const ToggleLanguage = () => {
  const { t, i18n, } = useTranslation();
  const router = useRouter();

  const toggle = () => {
    const next = normalizeLanguage(i18n.resolvedLanguage) === 'ru' ? 'en' : 'ru';
    persistLanguage(next);
    void i18n.changeLanguage(next);
    // Refresh server metadata as well as the visible translations.
    router.refresh();
  };
  return (
      <IconButton onClick={toggle} aria-label={t('switch-language')} title={t('switch-language')}>
        <TranslateIcon />
      </IconButton>
  );
};
