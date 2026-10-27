import { createReduxStore } from '~/app/providers/StoreProvider/config/store';
import { $api } from '~/shared/api/instance';
import { fetchCoursesByQuery } from '../services/fetchCoursesByQuery';
import { type Course } from '../types/course';
import { Response } from '~/shared/types/Response';

jest.mock('~/shared/api/instance', () => ({ $api: { get: jest.fn(), }, }));

test.each(['success', 'error'])(
  'an older request finishing with %s cannot replace the current search', async (outcome) => {
    const store = createReduxStore();
    let resolveRequest: (value: { data: Course[] }) => void = () => {};
    let rejectRequest: (error: Error) => void = () => {};
    const course: Course = {
      id: 1, name: 'Current result', author: 'Author', date: '2026-10-26', numberOfLessons: 2,
    };
    jest.mocked($api.get).mockReset().mockImplementationOnce(async () => await new Promise(
      (resolve, reject) => { resolveRequest = resolve; rejectRequest = reject; }
    )).mockResolvedValueOnce({ data: [course], });
    const oldRequest = store.dispatch(fetchCoursesByQuery({ query: 'old', lang: 'en', }));
    await store.dispatch(fetchCoursesByQuery({ query: 'current', lang: 'en', }));
    if (outcome === 'success') resolveRequest({ data: [], });
    else rejectRequest(new Error('Old request failed'));
    await oldRequest;
    expect(store.getState().course.courses).toEqual([course]);
    expect(store.getState().course.status).toBe(Response.OK);
  }
);
