import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import styles from './AboutInfo.module.scss';
import { features } from '~/shared/config/features';

export const AboutInfo = () => {
  const { t, } = useTranslation('about');
  return <section className={styles.about}>
    <p className='eyebrow'>{t('brand-name', { ns: 'translation', })} / {t('label')}</p>
    <h1>{t('title')}</h1>
    <div className={styles.introduction}>
      <h2>{t('why-choose-us')}</h2>
      <p className={styles.copy}>{t('intro')}</p>
    </div>
    <div className={styles.principles}>
      {['observe', 'interact', 'understand'].map((step, index) =>
        <article key={step}><span className='eyebrow'>0{index + 1}</span>
          <h2>{t(step + '-title')}</h2>
          <p className={styles.copy}>{t(step + '-description')}</p>
        </article>)}
    </div>
    <div className={styles.note}>
      <div><p className='eyebrow'>{t('demo-label')}</p><h2>{t('demo-title')}</h2>
        <p className={styles.copy}>{t('demo-description')}</p></div>
      <Link href={features.playground ? '/home#observatory' : '/courses'} className='action'>
        {t(features.playground ? 'try-demo' : 'browse-courses')}<ArrowForwardIcon />
      </Link>
    </div>
  </section>;
};
