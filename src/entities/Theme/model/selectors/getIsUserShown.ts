import { type StateSchema } from '~/app/providers/StoreProvider';

export const getIsUserShown = (state: StateSchema) => state.theme.isUserShown;
