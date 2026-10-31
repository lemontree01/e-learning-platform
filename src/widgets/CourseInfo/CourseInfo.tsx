import {
  ArrowForwardIcon, ArrowBackIcon, AutoStoriesOutlinedIcon
} from '~/shared/ui/SvgIcon/SvgIcon';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { useCourse } from '~/entities/Course/model/services/useCourse';
import { CourseFeedback } from '~/entities/Course/ui/CourseFeedback';
import { avatars } from '~/shared/assets/avatars';
import { CourseArtwork } from '~/shared/ui/CourseArtwork/CourseArtwork';
import { CourseIndex } from '~/widgets/CourseIndex/CourseIndex';
import { getRouteCourse, getRouteLesson } from '~/shared/routes/routes';
import { isComingSoon } from '~/entities/Course/model/presentation';
import { type ApiLanguage } from '~/entities/Course/api/getApiLanguage';
import { type Course } from '~/entities/Course/model/types/course';
import './courseInfo.scss';

const CourseInfo = ({ seed, }: { seed?: { language: ApiLanguage; course: Course } }) => {
  const params = useParams();
  const id = typeof params.id === 'string' ? params.id : undefined;
  const { course, status, } = useCourse(id, seed);
  const { t, } = useTranslation();
  if (!course || status !== 'ready') return <CourseFeedback status={status} />;
  const comingSoon = isComingSoon(course);
  const plan: unknown = t(`course-plan.${course.id}`, { returnObjects: true, });

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
              {t(comingSoon ? 'course-coming-soon-description' : 'course-full-description')}
            </p>
            <div className="course-facts">
              {!comingSoon && <span>
                <AutoStoriesOutlinedIcon />
                {t('lesson-count', { count: course.numberOfLessons, })}
              </span>}
              <span>{t(comingSoon ? 'coming-soon' : 'complete-course')}</span>
            </div>
            <Link className="action" href={comingSoon
              ? getRouteCourse('0')
              : getRouteLesson(String(course.id), '0')}>
              {t(comingSoon ? 'coming-soon-action' : 'open-first-lesson')}
              <ArrowForwardIcon />
            </Link>
            <div className="tutor">
              <img src={avatars[course.id % avatars.length]} alt="" width={40} height={40} />
              <div>
                <span className="eyebrow">{t('course-author')}</span>
                <p>{course.author}</p>
              </div>
            </div>
          </div>
          <div className="course-cover">
            <CourseArtwork id={course.id} eager />
            <div>
              <span className="eyebrow">{t('brand-name')}</span>
              <span className="eyebrow">{course.date}</span>
            </div>
          </div>
        </div>
      </section>
      <section className="playlist-videos">
        <div className="section-head">
          <h2>{t(comingSoon ? 'course-plan-title' : 'course-lessons')}</h2>
          {!comingSoon && <p className="demo-note">{t('outline-description')}</p>}
        </div>
        {comingSoon
          ? Array.isArray(plan) && (
          <ol className="lesson-list">
            {plan.map((topic: string, index) => (
              <li key={index}>
                <span className="lesson-number">{String(index + 1).padStart(2, '0')}</span>
                {topic}
              </li>
            ))}
          </ol>
          )
          : (
          <CourseIndex course={course} />
            )}
      </section>
    </>
  );
};
export default CourseInfo;
