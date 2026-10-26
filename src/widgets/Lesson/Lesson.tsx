import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useCourse } from '~/entities/Course/model/services/useCourse';
import { useLesson } from '~/entities/Course/model/services/useLesson';
import { CourseFeedback } from '~/entities/Course/ui/CourseFeedback';
import { avatars } from '~/shared/assets/avatars';
import { getRouteLesson } from '~/shared/routes/routes';
import { lessonTitle } from '~/entities/Course/model/presentation';
import { LessonBlocks } from './ui/LessonBlocks';
import { LessonNavigation } from './ui/LessonNavigation';
import './lesson.scss';

const Lesson = () => {
  const params = useParams();
  const lessonId = typeof params.lessonId === 'string' ? params.lessonId : undefined;
  const courseId =
    typeof params.courseId === 'string'
      ? params.courseId
      : lessonId !== undefined && typeof params.id === 'string'
        ? params.id
        : undefined;
  const { course, status, } = useCourse(courseId);
  const index = Number(lessonId);
  const validLesson = course !== undefined && lessonId !== undefined &&
    /^\d+$/.test(lessonId) && Number.isSafeInteger(index) && index < course.numberOfLessons;
  const { lesson, status: lessonStatus, retry, } = useLesson(
    validLesson ? courseId : undefined, validLesson ? lessonId : undefined
  );
  const { t, i18n, } = useTranslation();
  if (!courseId) {
    return (
      <section>
        <div className="state-panel">
          <h1 className="heading">{t('choose-course')}</h1>
          <Link href="/courses" className="action">
            {t('back-to-courses')}
          </Link>
        </div>
      </section>
    );
  }
  if (!course || status !== 'ready') return <CourseFeedback status={status} />;
  if (!validLesson) {
    return (
      <section>
        <div className="state-panel">
          <h1 className="heading">{t('lesson-not-found')}</h1>
          <Link href={`/course/${course.id}`} className="action">
            {t('view-course')}
          </Link>
        </div>
      </section>
    );
  }
  return (
    <section className="watch-video">
      <nav className="course-breadcrumb" aria-label={t('breadcrumb-label')}>
        <Link href={`/course/${course.id}`}>
          <ArrowBackIcon />
          {t('view-course')}
        </Link>
        <span>/</span>
        <span>
          {t('lesson')} {index + 1}
        </span>
      </nav>
      <div className="lesson-layout">
        <div className="video-container">
          <p className="eyebrow">
            {t('lesson-label')} / {String(index + 1).padStart(2, '0')}
          </p>
          <h1 className="title">
            {lessonTitle(course, index, `${course.name}. ${t('lesson')} ${index + 1}`)}
          </h1>
          <div className="tutor">
            <img src={avatars[course.id % avatars.length]} alt="" />
            <div>
              <p>{course.author}</p>
              <span>{course.date}</span>
            </div>
          </div>
          <div aria-live="polite" aria-busy={lessonStatus === 'loading'}>
          {lessonStatus === 'loading'
            ? <p role="status">{t('loading')}</p>
            : lesson
              ? (
            <LessonBlocks
              key={`${i18n.resolvedLanguage ?? i18n.language}:${course.id}:${index}`}
              blocks={lesson.blocks}
              title={lessonTitle(course, index, '')}
            />
                )
              : (
            <div className="lesson-placeholder">
              {lessonStatus === 'not-found'
                ? <h2>{t('lesson-not-found')}</h2>
                : <>
                  <p role="alert">{t('lesson-load-error')}</p>
                  <button type="button" className="action action-secondary" onClick={retry}>
                    {t('try-again')}
                  </button>
                </>}
            </div>
                )}
          </div>
          <nav className="lesson-pagination" aria-label={t('lesson-navigation')}>
            {index > 0
              ? (
              <Link prefetch={true} href={getRouteLesson(String(course.id), String(index - 1))}>
                <ArrowBackIcon />
                {t('previous-lesson')}
              </Link>
                )
              : (
              <span />
                )}
            {index + 1 < course.numberOfLessons && (
              <Link prefetch={true} href={getRouteLesson(String(course.id), String(index + 1))}>
                {t('next-lesson')}
                <ArrowForwardIcon />
              </Link>
            )}
          </nav>
        </div>
        <LessonNavigation course={course} index={index} />
      </div>
    </section>
  );
};
export default Lesson;
