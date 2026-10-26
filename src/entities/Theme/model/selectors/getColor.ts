import { type StateSchema } from '~/app/providers/StoreProvider';

export const getColor = (state: StateSchema) => state.theme.color;
