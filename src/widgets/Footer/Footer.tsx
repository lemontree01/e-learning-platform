import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import './footer.scss';

const Footer = () => {
  const { t, } = useTranslation();
  return <footer className='footer'>
    <div><span className='footer-wordmark'>{t('brand-name')}</span>
      <p>{t('footer-description')}</p></div>
    <nav aria-label={t('footer-navigation')}>
      <Link href='/courses'>{t('courses')}</Link>
      <Link href='/about'>{t('about')}</Link>
      <Link href='/contacts'>{t('contact-us')}</Link>
    </nav>
    <span className='eyebrow'>© {new Date().getFullYear()} · {t('public-demo')}</span>
  </footer>;
};
export default Footer;
