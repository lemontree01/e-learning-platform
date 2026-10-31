import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import styles from './contactInfo.module.scss';

const REPOSITORY = 'https://github.com/lemontree01/e-learning-platform';

const ContactInfo = () => {
  const { t, } = useTranslation('contacts');
  return <section className={styles.contact}>
    <div>
      <p className='eyebrow'>{t('brand-name', { ns: 'translation', })} / {t('label')}</p>
      <h1>{t('title')}</h1>
      <p className={styles.description}>{t('intro')}</p>
      <div className={styles.notice}>
        <Link href='/courses' className='text-link'>{t('browse-courses')} →</Link>
      </div>
    </div>
    <div className={styles.card}>
      <h2>{t('issues-title')}</h2>
      <p>{t('issues-description')}</p>
      <a className='action' href={`${REPOSITORY}/issues`}>{t('open-issue')}</a>
      <a className='text-link' href={REPOSITORY}>{t('view-source')} →</a>
    </div>
  </section>;
};
export default ContactInfo;
