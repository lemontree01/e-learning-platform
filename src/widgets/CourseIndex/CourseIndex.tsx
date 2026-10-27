import { useState } from 'react';
import Link from 'next/link';
import { useReducedMotion } from 'motion/react';
import * as m from 'motion/react-m';
import { MotionFeatures } from '~/shared/ui/MotionFeatures/MotionFeatures';
import { useTranslation } from 'react-i18next';
import { type Course } from '~/entities/Course/model/types/course';
import { lessonTitle } from '~/entities/Course/model/presentation';
import { getRouteLesson } from '~/shared/routes/routes';
import styles from './CourseIndex.module.scss';

export function CourseIndex ({ course, }: { course: Course }) {
  const { t, } = useTranslation();
  const reducedMotion = useReducedMotion();
  const [view, setView] = useState<'grid' | 'list'>('grid');
  return (
    <MotionFeatures><div className={styles.index} data-course-index data-view={view}>
      <div className={styles.toolbar}>
        <p className="eyebrow">
          {t('course-outline')}{' '}
          <span>/ {t('lesson-count', { count: course.numberOfLessons, })}</span>
        </p>
        <div className={styles.views} role="group" aria-label={t('syllabus-view')}>
          <button
            type="button"
            aria-pressed={view === 'grid'}
            onClick={() => {
              setView('grid');
            }}
          >
            {t('map-view')}
          </button>
          <button
            type="button"
            aria-pressed={view === 'list'}
            onClick={() => {
              setView('list');
            }}
          >
            {t('list-view')}
          </button>
        </div>
      </div>
      <m.ol
        layout={!reducedMotion}
        className={styles.lessons}
        aria-label={t('course-lessons')}
      >
        {Array.from({ length: course.numberOfLessons, }, (_, index) => (
          <m.li
            layout={!reducedMotion}
            key={index}
            transition={{ duration: 0.28, }}
          >
            <Link href={getRouteLesson(String(course.id), String(index))} prefetch={false}>
              <span className={styles.number}>
                {String(index + 1).padStart(2, '0')}
              </span>
              <span className={styles.title}>
                {lessonTitle(course, index, t('lesson') + ' ' + (index + 1))}
              </span>
              <span className={styles.arrow} aria-hidden="true">
                &#8599;
              </span>
            </Link>
          </m.li>
        ))}
      </m.ol>
      <div className={styles.foot}>
        <span>{t('syllabus-instruction')}</span>
        <span aria-hidden="true">
          01 &mdash; {String(course.numberOfLessons).padStart(2, '0')}
        </span>
      </div>
    </div></MotionFeatures>
  );
}
