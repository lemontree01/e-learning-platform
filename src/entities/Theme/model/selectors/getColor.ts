import { createSelector } from '@reduxjs/toolkit';
import { type StateSchema } from '~/app/providers/StoreProvider';

export const getColor = createSelector((state: StateSchema) =>
  state.theme.color, color => color);
