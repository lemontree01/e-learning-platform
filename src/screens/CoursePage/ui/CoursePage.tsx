import { useEffect } from 'react';
import CourseInfo from '~/widgets/CourseInfo/CourseInfo';

const CoursePage = () => {
  useEffect(() => {
    window.scrollTo({
      top: 0, left: 0, behavior: 'auto',
    });
  }, []);
  return (
    <>
      <CourseInfo />
    </>
  );
};

export default CoursePage;
