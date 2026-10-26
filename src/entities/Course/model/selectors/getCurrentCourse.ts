import { type StateSchema } from '~/app/providers/StoreProvider';

export const getCurrentCourse = (state: StateSchema) => state.course.currentCourse;
