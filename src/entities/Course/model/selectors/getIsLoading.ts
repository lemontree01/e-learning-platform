import { type StateSchema } from '~/app/providers/StoreProvider';

export const getStatus = (state: StateSchema) => state.course.status;
