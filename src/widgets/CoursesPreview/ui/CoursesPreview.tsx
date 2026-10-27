import { Suspense, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import * as m from 'motion/react-m';
import { MotionFeatures } from '~/shared/ui/MotionFeatures/MotionFeatures';
import { ArrowForwardIcon, AutoStoriesOutlinedIcon } from '~/shared/ui/SvgIcon/SvgIcon';
import { type Course } from '~/entities/Course';
import { getApiLanguage, type ApiLanguage } from '~/entities/Course/api/getApiLanguage';
import { fetchCourses } from '~/entities/Course/model/services/fetchCourses';
import { fetchCoursesByQuery } from '~/entities/Course/model/services/fetchCoursesByQuery';
import { getCatalogKey } from '~/entities/Course/model/catalogKey';
import { CourseArtwork } from '~/shared/ui/CourseArtwork/CourseArtwork';
import { isCompleteCourse } from '~/entities/Course/model/presentation';
import { avatars } from '~/shared/assets/avatars';
import { Response } from '~/shared/types/Response';
import { useAppDispatch, type StateSchema } from '~/app/providers/StoreProvider';
import styles from './CoursesPreview.module.scss';

const CoursesPreviewContent = ({
  featured = false, seed,
}: {
  featured?: boolean;
  seed?: { language: ApiLanguage; courses: Course[] };
}) => {
  const dispatch = useAppDispatch();
  const { t, i18n, } = useTranslation();
  const params = useSearchParams();
  const [retry, setRetry] = useState(0);
  const query = (params.get('search') ?? '').trim();
  const language = i18n.resolvedLanguage ?? i18n.language;
  const catalog = useSelector((state: StateSchema) => state.course);
  const matchesRequest = catalog.catalogKey === getCatalogKey(language, query);
  const seededCourses = !query && seed?.language === getApiLanguage(language)
    ? seed.courses
    : undefined;

  useEffect(() => {
    if (seededCourses) return;
    const request = query
      ? dispatch(fetchCoursesByQuery({ query, lang: language, }))
      : dispatch(fetchCourses(language));
    return () => {
      request.abort();
    };
  }, [dispatch, language, query, retry, seededCourses]);

  const courses = seededCourses ?? (matchesRequest ? catalog.courses : []);
  const status = seededCourses
    ? Response.OK
    : matchesRequest ? catalog.status : Response.LOADING;

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
              <m.span
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
                <m.span
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
      <m.div
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
            <m.article
              layout
              className={styles.card}
              key={course.id}
              initial={false}
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
                {!featured && <div className={styles.author}>
                  <img src={avatars[course.id % avatars.length]} alt="" width={28} height={28}
                    loading="lazy" decoding="async" />
                  <span>{course.author}</span>
                </div>}
                <Link
                  className={styles.open}
                  href={`/course/${course.id}`}
                  aria-label={`${t('view-course')}: ${course.name}`}
                >
                  {t('view-course')}
                  <ArrowForwardIcon />
                </Link>
              </div>
            </m.article>
          ))}
      </m.div>
      {featured && (
        <div className={styles['catalog-note']}>
          <span className="eyebrow">{t('learn-your-way')}</span>
          <p>{t('catalog-note')}</p>
        </div>
      )}
    </section>
  );
};

export const CoursesPreview = ({
  featured = false, seed,
}: {
  featured?: boolean;
  seed?: { language: ApiLanguage; courses: Course[] };
}) => (
  <MotionFeatures><Suspense fallback={null}>
    <CoursesPreviewContent featured={featured} seed={seed} />
  </Suspense></MotionFeatures>
);
