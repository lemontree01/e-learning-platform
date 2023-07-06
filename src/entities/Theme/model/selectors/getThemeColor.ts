import { createSelector } from '@reduxjs/toolkit';
import { type StateSchema } from '~/app/providers/StoreProvider';

export const getThemeColor = createSelector((state: StateSchema) =>
  state.theme.color, theme => theme);
