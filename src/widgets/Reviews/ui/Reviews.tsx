import { useTranslation } from 'react-i18next';
import styles from './reviews.module.scss';
import { reviews } from '../model/reviews';
import { renderStarRating } from '../lib/renderStarRating';
import { Text } from '~/shared/ui/Text';
import { Divider } from '~/shared/ui/Divider';

export const Reviews = () => {
  const { t, } = useTranslation('about');
  return (
    <section className={styles.reviews}>
      <Text bold size='xl' className={styles.heading}>{t('reviews')}</Text>
      <Divider />
      <div className={styles['box-container']}>
        {reviews.map((review, i) => <div key={i} className={styles.box}>
            <p>{review.text}</p>
            <div className={styles.student}>
              <img src={review.avatar} alt="" />
              <div>
                <h3>{review.author}</h3>
                <div className={styles.stars}>
                  {renderStarRating(review.stars)}
                </div>
              </div>
            </div>
          </div>)}
      </div>
    </section>
  );
};
