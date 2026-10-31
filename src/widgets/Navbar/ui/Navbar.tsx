import { useTranslation } from 'react-i18next';
import { RouteLink } from '~/shared/ui/RouteLink/RouteLink';

export const Navbar = () => {
  const { t, } = useTranslation();
  return <nav aria-label={t('all-pages')}>
    <RouteLink href='/home'>{t('home')}</RouteLink>
    <RouteLink href='/courses'>{t('courses')}</RouteLink>
    <RouteLink href='/about'>{t('about')}</RouteLink>
    <RouteLink href='/contacts'>{t('contact-us')}</RouteLink>
    <RouteLink href='/profile'>{t('account-view')}</RouteLink>
  </nav>;
};
