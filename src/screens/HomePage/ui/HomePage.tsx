import { lazy } from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { features } from '~/shared/config/features';
import { CoursesPreview } from '~/widgets/CoursesPreview';
import styles from './HomePage.module.scss';

const Observatory = lazy(async () => {
  const module = await import('~/widgets/Observatory/ui/Observatory');
  return { default: module.Observatory, };
});

const HomePage = () => {
  const { t, } = useTranslation();
  return (
    <>
      {features.playground
        ? <Observatory />
        : <section className={styles.intro}>
        <p className='eyebrow'>{t('home-eyebrow')}</p>
        <h1>{t('brand-name')}</h1>
        <p className={styles.description}>{t('home-description')}</p>
        <Link href='/courses' className='action'>
          {t('browse-courses')}<span aria-hidden='true'>→</span>
        </Link>
      </section>}
      <CoursesPreview featured />
    </>
  );
};

export default HomePage;
