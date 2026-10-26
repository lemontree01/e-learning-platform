import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useCourse } from '~/entities/Course/model/services/useCourse';
import { CourseFeedback } from '~/entities/Course/ui/CourseFeedback';
import { avatars } from '~/shared/assets/avatars';
import { getRouteLesson } from '~/shared/routes/routes';
import { features } from '~/shared/config/features';
import { LessonBlocks } from './ui/LessonBlocks';
import './lesson.scss';

const Lesson = () => {
  const params = useParams();
  const lessonId = typeof params.lessonId === 'string' ? params.lessonId : undefined;
  const courseId = typeof params.courseId === 'string'
    ? params.courseId
    : lessonId !== undefined && typeof params.id === 'string'
      ? params.id
      : undefined;
  const { course, status, } = useCourse(courseId);
  const { t, } = useTranslation();
  if (!courseId) {
    return <section><div className='state-panel'>
      <h1 className='heading'>{t('choose-course')}</h1>
      <Link href='/courses' className='action'>{t('back-to-courses')}</Link>
    </div></section>;
  }
  if (!course || status !== 'ready') return <CourseFeedback status={status} />;
  const index = Number(lessonId);
  if (lessonId === undefined || !/^\d+$/.test(lessonId) ||
    !Number.isSafeInteger(index) || index >= course.numberOfLessons) {
    return <section><div className='state-panel'>
      <h1 className='heading'>{t('lesson-not-found')}</h1>
      <Link href={`/course/${course.id}`} className='action'>{t('view-course')}</Link>
    </div></section>;
  }
  return <section className='watch-video'>
    <nav className='course-breadcrumb' aria-label={t('breadcrumb-label')}>
      <Link href={`/course/${course.id}`}><ArrowBackIcon />{t('view-course')}</Link>
      <span>/</span><span>{t('lesson')} {index + 1}</span>
    </nav>
    <div className='lesson-layout'>
      <div className='video-container'>
        <p className='eyebrow'>{t('lesson-label')} / {String(index + 1).padStart(2, '0')}</p>
        <h1 className='title'>{course.name}. {t('lesson')} {index + 1}</h1>
        <div className='tutor'>
          <img src={avatars[course.id % avatars.length]} alt='' />
          <div><p>{course.author}</p><span>{course.date}</span></div>
        </div>
        {course.lessons?.[index]
          ? <LessonBlocks blocks={course.lessons[index].blocks} />
          : <div className='lesson-placeholder'>
            <span className='placeholder-symbol' aria-hidden='true'>⌘</span>
            <h2>{t('coming-soon-title')}</h2>
            <p>{t('coming-soon-description')}</p>
            <Link href={features.playground ? '/home#observatory' : `/course/${course.id}`}
              className='action action-secondary'>
              {t(features.playground ? 'try-observatory' : 'back-to-overview')}<ArrowForwardIcon />
            </Link>
          </div>}
        <nav className='lesson-pagination' aria-label={t('lesson-navigation')}>
          {index > 0
            ? <Link href={getRouteLesson(String(course.id), String(index - 1))}>
            <ArrowBackIcon />{t('previous-lesson')}</Link>
            : <span />}
          {index + 1 < course.numberOfLessons &&
            <Link href={getRouteLesson(String(course.id), String(index + 1))}>
              {t('next-lesson')}<ArrowForwardIcon /></Link>}
        </nav>
      </div>
      <aside className='lesson-outline' aria-label={t('lesson-outline')}>
        <p className='eyebrow'>{t('course-outline')}</p>
        <h2>{course.name}</h2>
        <ol>
          {Array.from({ length: course.numberOfLessons, }, (_, lesson) =>
            <li key={lesson}>
              <Link href={getRouteLesson(String(course.id), String(lesson))}
                aria-current={lesson === index ? 'page' : undefined}>
                <span>{String(lesson + 1).padStart(2, '0')}</span>
                {t('lesson')} {lesson + 1}
                {lesson === index && <span className='current-lesson-dot' aria-hidden='true' />}
              </Link>
            </li>)}
        </ol>
      </aside>
    </div>
  </section>;
};
export default Lesson;
