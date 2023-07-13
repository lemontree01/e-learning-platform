import styles from './aboutInfo.module.scss';
import Background from '~/shared/assets/avatars/images/about.png';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export const AboutInfo = () => {
  const { t, } = useTranslation('about');
  return (
    <section className={styles.about}>
      <div className={styles.row}>
        <div className={styles.image}>
          <img src={Background} alt="" />
        </div>

        <div className={styles.content}>
          <h3>{t('why-choose-us')}</h3>
          <p>
          {t('description')}
          </p>
          <Link to="../courses" className="inline-btn">
            {t('our-courses')}
          </Link>
        </div>
      </div>

      <div className={styles['box-container']}>
        <div className={styles['inner-box']}>
          <i className="fas fa-graduation-cap"></i>
          <div>
            <h3>20+</h3>
            <p>{t('online-courses')}</p>
          </div>
        </div>

        <div className={styles['inner-box']}>
          <i className="fas fa-user-graduate"></i>
          <div>
            <h3>200+</h3>
            <p>{t('users')}</p>
          </div>
        </div>

        <div className={styles['inner-box']}>
          <i className="fas fa-chalkboard-user"></i>
          <div>
            <h3>200+</h3>
            <p>{t('lessons')}</p>
          </div>
        </div>

        <div className={styles['inner-box']}>
          <i className="fas fa-briefcase"></i>
          <div>
            <h3>100% {t('free')}</h3>
            <p>{t('lessons')}</p>
          </div>
        </div>
      </div>
    </section>
  );
};
