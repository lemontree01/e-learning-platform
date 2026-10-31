'use client';

import { useEffect } from 'react';
import CourseInfo from '~/widgets/CourseInfo/CourseInfo';
import { type ApiLanguage } from '~/entities/Course/api/getApiLanguage';
import { type Course } from '~/entities/Course/model/types/course';

const CoursePage = ({ seed, }: { seed?: { language: ApiLanguage; course: Course } }) => {
  useEffect(() => {
    window.scrollTo({
      top: 0, left: 0, behavior: 'auto',
    });
  }, []);
  return (
    <>
      <CourseInfo seed={seed} />
    </>
  );
};

export default CoursePage;
