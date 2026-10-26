import { type StateSchema } from '~/app/providers/StoreProvider';

export const getCourses = (state: StateSchema) => state.course.courses;
