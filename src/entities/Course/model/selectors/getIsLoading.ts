import { createSelector } from '@reduxjs/toolkit';
import { type StateSchema } from '~/app/providers/StoreProvider';

export const getStatus = createSelector((state: StateSchema) =>
  state.course.status, status => status);
