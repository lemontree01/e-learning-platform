import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import styles from './Brand.module.scss';

export function Brand () {
  const { t, } = useTranslation();
  return <Link href='/home' className={styles.brand}>
    <svg viewBox='0 0 36 36' fill='none' aria-hidden='true'>
      <path d='M18 9C13 5 7 5 3 7V29C7 27 13 27 18 31C23 27 29 27 33 29V7C29 5 23 5 18 9Z' />
      <path d='M18 9V31M7 12C10 11 12 12 14 13M22 13C25 11 27 11 29 12' />
    </svg>
    <span>{t('brand-first')}{' '}<span className={styles.second}>
      {t('brand-second')}<span className={styles.dot}>.</span>
    </span></span>
  </Link>;
}
