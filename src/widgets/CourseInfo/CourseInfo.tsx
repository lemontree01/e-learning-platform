import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AutoStoriesOutlinedIcon from '@mui/icons-material/AutoStoriesOutlined';
import { useCourse } from '~/entities/Course/model/services/useCourse';
import { CourseFeedback } from '~/entities/Course/ui/CourseFeedback';
import { avatars } from '~/shared/assets/avatars';
import { CourseArtwork } from '~/shared/ui/CourseArtwork/CourseArtwork';
import { CourseIndex } from '~/widgets/CourseIndex/CourseIndex';
import { getRouteLesson } from '~/shared/routes/routes';
import { isCompleteCourse, lessonTitle } from '~/entities/Course/model/presentation';
import './courseInfo.scss';

const CourseInfo = () => {
  const params = useParams();
  const id = typeof params.id === 'string' ? params.id : undefined;
  const { course, status, } = useCourse(id);
  const { t, } = useTranslation();
  if (!course || status !== 'ready') return <CourseFeedback status={status} />;

  return (
    <>
      <section className="playlist-details">
        <nav className="course-breadcrumb" aria-label={t('breadcrumb-label')}>
          <Link href="/courses">
            <ArrowBackIcon />
            {t('back-to-courses')}
          </Link>
          <span>/</span>
          <span>{t('course-overview')}</span>
        </nav>
        <div className="course-overview-grid">
          <div className="course-introduction">
            <p className="eyebrow">
              {t('collection-label')} / {String(course.id + 1).padStart(2, '0')}
            </p>
            <h1>{course.name}</h1>
            <p className="course-description">
              {t(isCompleteCourse(course) ? 'course-full-description' : 'course-demo-description')}
            </p>
            <div className="course-facts">
              <span>
                <AutoStoriesOutlinedIcon />
                {t('lesson-count', { count: course.numberOfLessons, })}
              </span>
              <span>{t(isCompleteCourse(course) ? 'complete-course' : 'demo-course')}</span>
            </div>
            <Link href={getRouteLesson(String(course.id), '0')} className="action">
              {t('open-first-lesson')}
              <ArrowForwardIcon />
            </Link>
            <div className="tutor">
              <img src={avatars[course.id % avatars.length]} alt="" />
              <div>
                <span className="eyebrow">{t('course-author')}</span>
                <p>{course.author}</p>
              </div>
            </div>
          </div>
          <div className="course-cover">
            <CourseArtwork id={course.id} />
            <div>
              <span className="eyebrow">{t('brand-name')}</span>
              <span className="eyebrow">{course.date}</span>
            </div>
          </div>
        </div>
      </section>
      <section className="playlist-videos">
        <div className="section-head">
          <div>
            <p className="eyebrow">{t('course-outline')}</p>
            <h2>{t('course-lessons')}</h2>
          </div>
          <p className="demo-note">{t('outline-description')}</p>
        </div>
        {isCompleteCourse(course)
          ? (
          <CourseIndex course={course} />
            )
          : (
          <ol className="lesson-list">
            {Array.from({ length: course.numberOfLessons, }, (_, index) => {
              const name = lessonTitle(course, index, `${course.name} (${t('part')} ${index + 1})`);
              return (
                <li key={index}>
                  <Link href={getRouteLesson(String(course.id), String(index))}>
                    <span className="lesson-number">{String(index + 1).padStart(2, '0')}</span>
                    <div>
                      <h3>{name}</h3>
                      <p>{t('lesson-preview')}</p>
                    </div>
                    <ArrowForwardIcon />
                  </Link>
                </li>
              );
            })}
          </ol>
            )}
      </section>
    </>
  );
};
export default CourseInfo;
