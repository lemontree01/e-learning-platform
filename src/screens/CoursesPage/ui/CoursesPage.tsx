'use client';

import { CoursesPreview } from '~/widgets/CoursesPreview';
import { type ApiLanguage } from '~/entities/Course/api/getApiLanguage';
import { type Course } from '~/entities/Course/model/types/course';

const CoursesPage = ({ seed, }: { seed?: { language: ApiLanguage; courses: Course[] } }) => {
  return <CoursesPreview seed={seed} />;
};

export default CoursesPage;
