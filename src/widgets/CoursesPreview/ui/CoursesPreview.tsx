import { Suspense, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import AutoStoriesOutlinedIcon from '@mui/icons-material/AutoStoriesOutlined';
import { type Course, getCourses, getStatus } from '~/entities/Course';
import { fetchCourses } from '~/entities/Course/model/services/fetchCourses';
import { fetchCoursesByQuery } from '~/entities/Course/model/services/fetchCoursesByQuery';
import { CourseArtwork } from '~/shared/ui/CourseArtwork/CourseArtwork';
import { isCompleteCourse } from '~/entities/Course/model/presentation';
import { avatars } from '~/shared/assets/avatars';
import { Response } from '~/shared/types/Response';
import { useAppDispatch } from '~/app/providers/StoreProvider';
import styles from './CoursesPreview.module.scss';

const CoursesPreviewContent = ({ featured = false, }: { featured?: boolean }) => {
  const dispatch = useAppDispatch();
  const { t, i18n, } = useTranslation();
  const params = useSearchParams();
  const [retry, setRetry] = useState(0);
  const query = (params.get('search') ?? '').trim();
  const language = i18n.resolvedLanguage ?? i18n.language;
  const courses = useSelector(getCourses);
  const status = useSelector(getStatus);

  useEffect(() => {
    const request = query
      ? dispatch(fetchCoursesByQuery({ query, lang: language, }))
      : dispatch(fetchCourses(language));
    return () => {
      request.abort();
    };
  }, [dispatch, language, query, retry]);

  const visibleCourses = featured
    ? courses.filter((course) => !isCompleteCourse(course)).slice(0, 3)
    : courses;
  const CardHeading = featured ? 'h3' : 'h2';
  return (
    <section className={styles.library} aria-labelledby="library-title">
      <div className="section-head">
        <div>
          <p className="eyebrow">{t('library-eyebrow')}</p>
          {featured
            ? (
            <h2 id="library-title">{t('featured-title')}</h2>
              )
            : (
            <h1 id="library-title">{query ? t('search-title', { query, }) : t('library-title')}</h1>
              )}
          {!featured && <p className={styles.description}>{t('library-description')}</p>}
        </div>
        {featured
          ? (
          <Link href="/courses" className="text-link">
            {t('all-courses')}
            <ArrowForwardIcon />
          </Link>
            )
          : (
              status === Response.OK && (
            <span className="eyebrow">{t('course-count', { count: courses.length, })}</span>
              )
            )}
      </div>
      {!featured && (
        <nav className={styles.topics} aria-label={t('course-topics')}>
          <Link href="/courses" aria-current={!query ? 'page' : undefined}>
            {!query && (
              <motion.span
                className={styles['topic-indicator']}
                layoutId="course-topic"
                transition={{ duration: 0.28, }}
              />
            )}
            {t('all-topics')}
          </Link>
          {['JavaScript', 'TypeScript', 'React', 'Python'].map((topic) => (
            <Link
              key={topic}
              href={`/courses?search=${encodeURIComponent(topic)}`}
              aria-current={query.toLowerCase() === topic.toLowerCase() ? 'page' : undefined}
            >
              {query.toLowerCase() === topic.toLowerCase() && (
                <motion.span
                  className={styles['topic-indicator']}
                  layoutId="course-topic"
                  transition={{ duration: 0.28, }}
                />
              )}
              {topic}
            </Link>
          ))}
        </nav>
      )}
      {status === Response.ERROR && (
        <div className="state-panel" role="alert">
          <h2>{t('catalog-error')}</h2>
          <p>{t('try-again-description')}</p>
          <button
            className="action"
            onClick={() => {
              setRetry(retry + 1);
            }}
          >
            {t('try-again')}
          </button>
        </div>
      )}
      {status === Response.OK && courses.length === 0 && (
        <div className="state-panel">
          <p role="status">{t('no-courses-found')}</p>
          <Link href="/courses" className="action action-secondary">
            {t('all-courses')}
          </Link>
        </div>
      )}
      <motion.div
        layout
        className={`${styles.grid} ${featured ? styles.compact : ''}`}
        aria-busy={status === Response.LOADING}
      >
        {status === Response.LOADING &&
          [0, 1, 2].map((index) => (
            <div className={styles.skeleton} key={index} aria-label={t('loading')} role="status">
              <div />
              <span />
              <span />
            </div>
          ))}
        {status === Response.OK &&
          visibleCourses.map((course: Course) => (
            <motion.article
              layout
              className={styles.card}
              key={course.id}
              initial={{ opacity: 0, y: 12, }}
              animate={{ opacity: 1, y: 0, }}
              transition={{ duration: 0.28, }}
            >
              <Link
                className={styles.cover}
                href={`/course/${course.id}`}
                tabIndex={-1}
                aria-hidden="true"
              >
                <CourseArtwork id={course.id} />
              </Link>
              <div className={styles.content}>
                <div className={styles.metadata}>
                  <span>
                    <AutoStoriesOutlinedIcon />
                    {t('lesson-count', { count: course.numberOfLessons, })}
                  </span>
                  <span>{t(isCompleteCourse(course) ? 'complete-course' : 'demo-course')}</span>
                </div>
                <CardHeading>
                  <Link href={`/course/${course.id}`}>{course.name}</Link>
                </CardHeading>
                <div className={styles.author}>
                  <img src={avatars[course.id % avatars.length]} alt="" />
                  <span>{course.author}</span>
                </div>
                <Link
                  className={styles.open}
                  href={`/course/${course.id}`}
                  aria-label={`${t('view-course')}: ${course.name}`}
                >
                  {t('view-course')}
                  <ArrowForwardIcon />
                </Link>
              </div>
            </motion.article>
          ))}
      </motion.div>
      {featured && (
        <div className={styles['catalog-note']}>
          <span className="eyebrow">{t('learn-your-way')}</span>
          <p>{t('catalog-note')}</p>
        </div>
      )}
    </section>
  );
};

export const CoursesPreview = ({ featured = false, }: { featured?: boolean }) => (
  <Suspense fallback={null}>
    <CoursesPreviewContent featured={featured} />
  </Suspense>
);
