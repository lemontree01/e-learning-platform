import { type StateSchema } from '~/app/providers/StoreProvider';

export const getIsSidebarShown = (state: StateSchema) => state.theme.isSidebarShown;
