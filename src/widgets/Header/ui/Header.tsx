import { RouteLink } from '~/shared/ui/RouteLink/RouteLink';
import { useTranslation } from 'react-i18next';
import { Brand } from '~/shared/ui/Brand/Brand';
import { SearchCourse } from '~/features/SearchCourse';
import { ToggleSidebar } from '~/features/ToggleSidebar/ui/ToggleSidebar';
import { ToggleTheme } from '~/features/ToggleTheme';
import { ToggleLanguage } from '~/features/ToggleLanguage';
import styles from './header.module.scss';
import { useAccount } from '~/entities/Account/AccountProvider';
import Link from 'next/link';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';

export const Header = () => {
  const { t, } = useTranslation();
  const { user, } = useAccount();
  return <header className={styles.header}>
    <div className={styles.inner}>
      <Brand />
      <nav className={styles.navigation} aria-label={t('primary-navigation')}>
        <RouteLink href='/home'>{t('home')}</RouteLink>
        <RouteLink href='/courses'>{t('courses')}</RouteLink>
        <RouteLink href='/about'>{t('about')}</RouteLink>
      </nav>
      <div className={styles.search}><SearchCourse /></div>
      <div className={styles.controls}>
        <Link href={user ? '/profile' : '/login'} className={styles.account}
          aria-label={t(user ? 'account-view' : 'account-sign-in')}>
          <PersonOutlineIcon aria-hidden='true' />
        </Link>
        <ToggleTheme /><ToggleLanguage /><ToggleSidebar />
      </div>
    </div>
  </header>;
};
