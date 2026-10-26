import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import styles from './contactInfo.module.scss';

const ContactInfo = () => {
  const { t, } = useTranslation('contacts');
  return <section className={styles.contact}>
    <div>
      <p className='eyebrow'>{t('brand-name', { ns: 'translation', })} / {t('label')}</p>
      <h1>{t('get in touch')}</h1>
      <p className={styles.description}>{t('intro')}</p>
      <div className={styles.notice}>
        <span className='eyebrow'>{t('preview-label')}</span>
        <p id='contact-status' role='status'>{t('contacts-unavailable', { ns: 'translation', })}</p>
        <Link href='/courses' className='text-link'>{t('browse-courses')} →</Link>
      </div>
    </div>
    <form aria-describedby='contact-status' onSubmit={(event) => { event.preventDefault(); }}>
      <h2>{t('form-preview')}</h2>
      <fieldset>
        <label>{t('enter your name')}
          <input name='name' type='text' autoComplete='name' />
        </label>
        <label>{t('enter your email')}
          <input name='email' type='email' autoComplete='email' />
        </label>
        <label>{t('enter your message')}
          <textarea name='message' rows={5} />
        </label>
        <button type='submit' className='action' disabled aria-describedby='contact-status'>
          {t('send message')}
        </button>
      </fieldset>
    </form>
  </section>;
};
export default ContactInfo;
