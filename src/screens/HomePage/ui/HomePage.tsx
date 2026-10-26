import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { useCourse } from '~/entities/Course/model/services/useCourse';
import { CourseIndex } from '~/widgets/CourseIndex/CourseIndex';
import { CoursesPreview } from '~/widgets/CoursesPreview';
import styles from './HomePage.module.scss';

const HomePage = () => {
  const { t, } = useTranslation();
  const { course, status, } = useCourse('0');
  return (
    <>
      <section className={styles.hero}>
        <div className={styles.heading}>
          <p className="eyebrow">
            <span className={styles.rule} />
            {t('home-eyebrow')}
          </p>
          <h1>{t('home-title')}</h1>
        </div>
        <div className={styles.intro}>
          <span className={styles.edition} aria-hidden="true">
            JS / 001
          </span>
          <p>{t('home-description')}</p>
          <div className={styles.actions}>
            <Link href="/course/0/lesson/0" className="action">
              {t('start-learning')}
              <span aria-hidden="true">↗</span>
            </Link>
            <Link href="/courses" className="text-link">
              {t('browse-courses')}
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>
      <section className={styles.featured} aria-labelledby="featured-course-title">
        <div className={styles['featured-head']}>
          <div>
            <p className="eyebrow">{t('featured-path')}</p>
            <h2 id="featured-course-title">{course?.name ?? 'JavaScript'}</h2>
          </div>
          <div className={styles.caption}>
            <p>{t('featured-caption')}</p>
            <span>{t('complete-course')}</span>
          </div>
        </div>
        {course && status === 'ready'
          ? (
          <CourseIndex course={course} />
            )
          : (
          <div className={styles.loading} aria-busy={status === 'loading'}>
            <p>
              {t(status === 'error' || status === 'not-found' ? 'course-load-error' : 'loading')}
            </p>
            <Link href="/course/0" className="text-link">
              {t('view-course')} →
            </Link>
          </div>
            )}
      </section>
      <CoursesPreview featured />
    </>
  );
};

export default HomePage;
