import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  type Course,
  getCourses,
  getStatus,
  courseActions
} from '~/entities/Course';
import { fetchCourses } from '~/entities/Course/model/services/fetchCourses';
import { avatars } from '~/shared/assets/avatars';
import { Response } from '~/shared/types/Response';
import { Avatar } from '~/shared/ui/Avatar';
import styles from './CoursesPreview.module.scss';
import { useTranslation } from 'react-i18next';
import { Text } from '~/shared/ui/Text';
import { Divider } from '~/shared/ui/Divider';
import CourseLoading from '~/shared/ui/CourseLoading/CourseLoading';
import { useAppDispatch } from '~/app/providers/StoreProvider';

export const CoursesPreview = () => {
  const dispatch = useAppDispatch();
  const { t, i18n, } = useTranslation();

  useEffect(() => {
    dispatch(fetchCourses(i18n.language));
  }, [dispatch, i18n.language]);

  const courses = useSelector(getCourses);
  const status = useSelector(getStatus);

  return (<section className="courses courses-preview">
    <Text size="xl" bold>{t('our-courses')}</Text>
    <Divider />
    <div className={styles['box-container']}>
    {status === Response.ERROR &&
    <Text size='l' bold={true} variant='accent'>{t('server error')}</Text>}
    {status === Response.LOADING && [...Array(6)].map((_, index) => (
              <div className={styles.box} key={index}><CourseLoading /></div>
    ))}
    {status === Response.OK && courses.map((course: Course) => (
              <div className={styles.box} key={course.id}>
                <div className={styles.tutor}>
                  <Avatar src={avatars[course.id % 9]} alt="" />
                  <div className="info">
                    <Text size='m' bold>{course.author}</Text>
                    <Text size='s'>{course.date}</Text>
                  </div>
                </div>
                <div className={styles.thumb}>
                  <img
                    src={
                      (process.env.SERVER_URL ??
    'https://sleepy-jay-bracelet.cyclic.app') + '/course-' + course.id + '.jpg'
                    }
                    alt=""
                  />
                  <span>{course.numberOfLessons} videos</span>
                </div>
                <Text size='m' bold>{course.name}</Text>
                <Link
                  to={'../course/' + course.id}
                  onClick={() =>
                    dispatch(courseActions.setCurrentCourse(course))}
                  className={`${styles.link} inline-btn`}
                >
                  view playlist
                </Link>
              </div>
    ))}
    </div>
  </section>);
};
