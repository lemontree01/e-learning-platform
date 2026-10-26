import {
  lazy
} from 'react';

export const CoursePageAsync = lazy(async () => await import('./CoursePage'));
