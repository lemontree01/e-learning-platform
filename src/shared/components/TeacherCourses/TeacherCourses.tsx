import React from 'react';
import './teacherCourses.scss';
import { useTranslation } from 'react-i18next';
import { CoursesPreview } from '~/widgets/CoursesPreview';

const TeacherCourses = () => {
  const { t, } = useTranslation('teachers');
  return (
    <section className="courses">
      <CoursesPreview />
    </section>
  );
};

export default TeacherCourses;
