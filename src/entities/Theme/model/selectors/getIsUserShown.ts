import { createSelector } from '@reduxjs/toolkit';
import { type StateSchema } from '~/app/providers/StoreProvider';

export const getIsUserShown = createSelector((state: StateSchema) =>
  state.theme.isUserShown, isUserShown => isUserShown);
