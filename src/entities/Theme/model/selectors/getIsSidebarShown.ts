import { createSelector } from '@reduxjs/toolkit';
import { type StateSchema } from '~/app/providers/StoreProvider';

export const getIsSidebarShown = createSelector((state: StateSchema) =>
  state.theme.isSidebarShown, isSidebarShown => isSidebarShown);
