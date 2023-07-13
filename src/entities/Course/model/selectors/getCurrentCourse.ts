import { createSelector } from '@reduxjs/toolkit';
import { type StateSchema } from '~/app/providers/StoreProvider';

export const getCurrentCourse = createSelector((state: StateSchema) =>
  state.course.currentCourse, currentCourse => currentCourse);
