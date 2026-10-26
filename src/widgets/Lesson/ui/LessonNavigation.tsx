import { useId, useState } from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { type Course } from '~/entities/Course/model/types/course';
import { lessonTitle } from '~/entities/Course/model/presentation';
import { getRouteLesson } from '~/shared/routes/routes';
import { Drawer } from '~/shared/ui/Drawer/Drawer';

function Outline ({ course, index, }: { course: Course; index: number }) {
  const { t, } = useTranslation();
  const marker = useId();
  return (
    <>
      <p className="eyebrow">{t('course-outline')}</p>
      <h2>{course.name}</h2>
      <ol>
        {Array.from({ length: course.numberOfLessons, }, (_, lesson) => (
          <li key={lesson}>
            <Link
              prefetch={true}
              href={getRouteLesson(String(course.id), String(lesson))}
              aria-current={lesson === index ? 'page' : undefined}
            >
              {lesson === index && (
                <motion.span
                  className="lesson-active-marker"
                  layoutId={marker}
                  transition={{ duration: 0.28, }}
                />
              )}
              <span>{String(lesson + 1).padStart(2, '0')}</span>
              {lessonTitle(course, lesson, `${t('lesson')} ${lesson + 1}`)}
            </Link>
          </li>
        ))}
      </ol>
    </>
  );
}

export function LessonNavigation ({ course, index, }: { course: Course; index: number }) {
  const { t, } = useTranslation();
  const [open, setOpen] = useState(false);
  return (
    <>
      <aside className="lesson-outline desktop-outline" aria-label={t('lesson-outline')}>
        <Outline course={course} index={index} />
      </aside>
      <nav className="mobile-lesson-bar" aria-label={t('lesson-navigation')}>
        {index > 0
          ? (
          <Link
            prefetch={true}
            href={getRouteLesson(String(course.id), String(index - 1))}
            aria-label={t('previous-lesson')}
          >
            ←
          </Link>
            )
          : (
          <span />
            )}
        <button
          type="button"
          onClick={() => {
            setOpen(true);
          }}
          aria-haspopup="dialog"
          aria-expanded={open}
        >
          <span>
            {String(index + 1).padStart(2, '0')} / {String(course.numberOfLessons).padStart(2, '0')}
          </span>
          {t('choose-lesson')}
          <span aria-hidden="true">↑</span>
        </button>
        {index + 1 < course.numberOfLessons
          ? (
          <Link
            prefetch={true}
            href={getRouteLesson(String(course.id), String(index + 1))}
            aria-label={t('next-lesson')}
          >
            →
          </Link>
            )
          : (
          <span />
            )}
      </nav>
      <Drawer
        open={open}
        onDismiss={() => {
          setOpen(false);
        }}
        label={t('choose-lesson')}
        className="lesson-drawer"
      >
        <button
          type="button"
          className="lesson-drawer-close"
          onClick={() => {
            setOpen(false);
          }}
        >
          {t('close-lessons')}
          <span aria-hidden="true">×</span>
        </button>
        <div className="lesson-outline">
          <Outline course={course} index={index} />
        </div>
      </Drawer>
    </>
  );
}
