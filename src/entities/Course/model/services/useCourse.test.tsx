import { type ReactNode } from 'react';
import { act, renderHook, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import i18n from 'i18next';
import { createReduxStore } from '~/app/providers/StoreProvider/config/store';
import { $api } from '~/shared/api/instance';
import { type Course } from '../types/course';
import { useCourse, usePrefetchCourse } from './useCourse';

jest.mock('~/shared/api/instance', () => ({ $api: { get: jest.fn(), }, }));

const course: Course = {
  id: 12,
  name: 'React lessons',
  author: 'Example Author',
  date: '2023-05-01',
  numberOfLessons: 3,
};

function createWrapper () {
  const store = createReduxStore();
  return function Wrapper ({ children, }: { children: ReactNode }) {
    return <Provider store={store}>{children}</Provider>;
  };
}

beforeEach(async () => {
  jest.mocked($api.get).mockReset();
  i18n.addResourceBundle('ru', 'translation', { lesson: 'Lesson', });
  await i18n.changeLanguage('en');
});

test('reuses a loaded course immediately when a lesson or page remounts', async () => {
  jest.mocked($api.get).mockResolvedValue({ data: course, });
  const wrapper = createWrapper();
  const first = renderHook(() => useCourse('12'), { wrapper, });
  await waitFor(() => { expect(first.result.current.status).toBe('ready'); });
  first.unmount();

  const next = renderHook(() => useCourse('12'), { wrapper, });
  expect(next.result.current).toEqual({ course, status: 'ready', });
  expect($api.get).toHaveBeenCalledTimes(1);
});

test('prefetches a course once so its page renders without waiting', async () => {
  jest.mocked($api.get).mockResolvedValue({ data: course, });
  const wrapper = createWrapper();
  const prefetch = renderHook(() => usePrefetchCourse(), { wrapper, }).result.current;
  prefetch(12);
  prefetch(12);
  await act(async () => { await new Promise(resolve => setTimeout(resolve, 0)); });
  prefetch(12);

  const page = renderHook(() => useCourse('12'), { wrapper, });
  expect(page.result.current).toEqual({ course, status: 'ready', });
  expect($api.get).toHaveBeenCalledTimes(1);
});

test('never displays the previous course while a different course loads', async () => {
  jest.mocked($api.get).mockResolvedValueOnce({ data: course, });
  const hook = renderHook(({ id, }) => useCourse(id), {
    initialProps: { id: '12', }, wrapper: createWrapper(),
  });
  await waitFor(() => { expect(hook.result.current.status).toBe('ready'); });
  jest.mocked($api.get).mockImplementation(async () => await new Promise(() => {}));
  hook.rerender({ id: '13', });
  expect(hook.result.current).toEqual({ course: undefined, status: 'loading', });
});

test('caches translations separately and reuses them when switching back', async () => {
  const translated = { ...course, name: 'Translated lessons', };
  jest.mocked($api.get).mockResolvedValueOnce({ data: course, });
  const hook = renderHook(() => useCourse('12'), { wrapper: createWrapper(), });
  await waitFor(() => { expect(hook.result.current.course?.name).toBe(course.name); });
  jest.mocked($api.get).mockResolvedValueOnce({ data: translated, });
  await act(async () => { await i18n.changeLanguage('ru'); });
  await waitFor(() => { expect(hook.result.current.course?.name).toBe(translated.name); });
  expect($api.get).toHaveBeenLastCalledWith('/courses/12', expect.objectContaining({
    params: { lang: 'rus', },
  }));
  await act(async () => { await i18n.changeLanguage('en'); });
  expect(hook.result.current.course?.name).toBe(course.name);
  expect($api.get).toHaveBeenCalledTimes(2);
});

test('shows the server course without requesting it again', () => {
  const hook = renderHook(
    () => useCourse('12', { language: 'eng', course, }),
    { wrapper: createWrapper(), }
  );
  expect(hook.result.current).toEqual({ course, status: 'ready', });
  expect($api.get).not.toHaveBeenCalled();
});

test('requests a course when the server copy is for another language', async () => {
  jest.mocked($api.get).mockResolvedValue({ data: course, });
  const hook = renderHook(
    () => useCourse('12', { language: 'rus', course: { ...course, name: 'Старый', }, }),
    { wrapper: createWrapper(), }
  );
  expect(hook.result.current).toEqual({ course: undefined, status: 'loading', });
  await waitFor(() => { expect(hook.result.current.course).toEqual(course); });
});

test.each([undefined, 'abc', '-1', '9007199254740992'])(
  'rejects invalid course ID %s without a request', (id) => {
    const hook = renderHook(() => useCourse(id), { wrapper: createWrapper(), });
    expect(hook.result.current).toEqual({ course: undefined, status: 'not-found', });
    expect($api.get).not.toHaveBeenCalled();
  }
);

test('a failed request can be retried on a later visit', async () => {
  jest.mocked($api.get).mockRejectedValueOnce(new Error('Offline'));
  const wrapper = createWrapper();
  const first = renderHook(() => useCourse('12'), { wrapper, });
  await waitFor(() => { expect(first.result.current.status).toBe('error'); });
  first.unmount();
  jest.mocked($api.get).mockResolvedValueOnce({ data: course, });
  const next = renderHook(() => useCourse('12'), { wrapper, });
  await waitFor(() => { expect(next.result.current.course).toEqual(course); });
});
