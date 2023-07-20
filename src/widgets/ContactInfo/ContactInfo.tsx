import { useTranslation } from 'react-i18next';
import styles from './contactInfo.module.scss';
import contactImg from
  '~/shared/assets/backgrounds/images/contact-background.png';
import { Text } from '~/shared/ui/Text';
import { Link } from 'react-router-dom';

const ContactInfo = () => {
  const { t, } = useTranslation('contacts');
  return (
    <section className={styles.contact}>
      <div className={styles.row}>
        <div className={styles.image}>
          <img src={contactImg} alt="" />
        </div>

        <form action="">
          <Text bold size='l'>{t('get in touch')}</Text>
          <input
            type="text"
            placeholder={t('enter your name') ?? ''}
            name="name"
            required
            className={styles.box}
          />
          <input
            type="email"
            placeholder={t('enter your email') ?? ''}
            name="email"
            required
            className={styles.box}
          />
          <input
            type="number"
            placeholder={t('enter your number') ?? ''}
            name="number"
            required
            className={styles.box}
          />
          <textarea
            name="msg"
            className={styles.box}
            placeholder={t('enter your message') ?? ''}
            required
            cols={30}
            rows={10}
          ></textarea>
          <Link
            className={'btn'}
            to="/home"
          >{t('send message')}</Link>
        </form>
      </div>

      <div className={styles['box-container']}>
        <div className={styles.box}>
          <i className="fas fa-phone"></i>
          <Text bold size='l'>{t('phone number')}</Text>
          <a href="tel:1234567890">123-456-7890</a>
          <a href="tel:1112223333">111-222-3333</a>
        </div>

        <div className={styles.box}>
          <i className="fas fa-envelope"></i>
          <Text bold size='l'>{t('email address')}</Text>
          <a href="">mailmail@gmail.come</a>
          <a href="">mailmail@gmail.come</a>
        </div>

        <div className={styles.box}>
          <i className="fas fa-map-marker-alt"></i>
          <h3>{t('office address')}</h3>
          <a href="#">
            2158 Elm Avenue Springfield Illinois 62701 United States
          </a>
        </div>
      </div>
    </section>
  );
};

export default ContactInfo;
