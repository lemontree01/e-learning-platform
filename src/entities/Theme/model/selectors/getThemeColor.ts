import { type StateSchema } from '~/app/providers/StoreProvider';

export const getThemeColor = (state: StateSchema) => state.theme.color;
