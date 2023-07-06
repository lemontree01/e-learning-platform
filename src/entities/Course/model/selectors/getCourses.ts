import { createSelector } from '@reduxjs/toolkit';
import { type StateSchema } from '~/app/providers/StoreProvider';
import { type Course } from '../types/course';

export const getCourses = createSelector<any, Course[]>((state: StateSchema) =>
  state.course.courses, courses => courses);
