import { type ReactNode } from 'react';
import { act, renderHook, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import i18n from 'i18next';
import { createReduxStore } from '~/app/providers/StoreProvider/config/store';
import { $api } from '~/shared/api/instance';
import { useLesson } from './useLesson';

jest.mock('~/shared/api/instance', () => ({ $api: { get: jest.fn(), }, }));

const lesson = {
  title: 'First lesson',
  blocks: [{ type: 'text', heading: 'Introduction', body: 'Stored lesson content', }],
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

test('loads only the opened lesson and reuses it on later visits', async () => {
  jest.mocked($api.get).mockResolvedValue({ data: lesson, });
  const wrapper = createWrapper();
  const first = renderHook(() => useLesson('12', '0'), { wrapper, });
  await waitFor(() => { expect(first.result.current.lesson).toEqual(lesson); });
  expect($api.get).toHaveBeenCalledTimes(1);
  expect($api.get).toHaveBeenCalledWith('/courses/12/lessons/0', expect.objectContaining({
    params: { lang: 'eng', },
  }));
  first.unmount();
  const next = renderHook(() => useLesson('12', '0'), { wrapper, });
  expect(next.result.current.status).toBe('ready');
  expect(next.result.current.lesson).toEqual(lesson);
  expect($api.get).toHaveBeenCalledTimes(1);
});

test('does not display another lesson while the requested one loads', async () => {
  jest.mocked($api.get).mockResolvedValueOnce({ data: lesson, });
  const hook = renderHook(({ id, }) => useLesson('12', id), {
    initialProps: { id: '0', }, wrapper: createWrapper(),
  });
  await waitFor(() => { expect(hook.result.current.status).toBe('ready'); });
  jest.mocked($api.get).mockImplementation(async () => await new Promise(() => {}));
  hook.rerender({ id: '1', });
  expect(hook.result.current.status).toBe('loading');
  expect(hook.result.current.lesson).toBeUndefined();
  expect($api.get).toHaveBeenCalledTimes(2);
});

test('separates cached bodies by course and language', async () => {
  jest.mocked($api.get).mockResolvedValueOnce({ data: lesson, });
  const hook = renderHook(({ courseId, }) => useLesson(courseId, '0'), {
    initialProps: { courseId: '12', }, wrapper: createWrapper(),
  });
  await waitFor(() => { expect(hook.result.current.lesson).toEqual(lesson); });
  const translated = { ...lesson, title: 'Translated lesson', };
  jest.mocked($api.get).mockResolvedValueOnce({ data: translated, });
  await act(async () => { await i18n.changeLanguage('ru'); });
  await waitFor(() => { expect(hook.result.current.lesson).toEqual(translated); });
  expect($api.get).toHaveBeenLastCalledWith('/courses/12/lessons/0',
    expect.objectContaining({ params: { lang: 'rus', }, }));
  await act(async () => { await i18n.changeLanguage('en'); });
  expect(hook.result.current.lesson).toEqual(lesson);
  expect($api.get).toHaveBeenCalledTimes(2);
  const other = { ...lesson, title: 'Different course', };
  jest.mocked($api.get).mockResolvedValueOnce({ data: other, });
  hook.rerender({ courseId: '13', });
  await waitFor(() => { expect(hook.result.current.lesson).toEqual(other); });
  expect($api.get).toHaveBeenCalledTimes(3);
});

test('ignores aborted responses when navigating quickly', async () => {
  let resolveFirst!: (response: { data: typeof lesson }) => void;
  jest.mocked($api.get).mockImplementationOnce(async () => await new Promise(resolve => {
    resolveFirst = resolve;
  }));
  const hook = renderHook(({ id, }) => useLesson('12', id), {
    initialProps: { id: '0', }, wrapper: createWrapper(),
  });
  const signal = jest.mocked($api.get).mock.calls[0][1]?.signal;
  const second = { ...lesson, title: 'Second lesson', };
  jest.mocked($api.get).mockResolvedValueOnce({ data: second, });
  hook.rerender({ id: '1', });
  expect(signal?.aborted).toBe(true);
  await waitFor(() => { expect(hook.result.current.lesson).toEqual(second); });
  await act(async () => { resolveFirst({ data: lesson, }); });
  expect(hook.result.current.lesson).toEqual(second);
  jest.mocked($api.get).mockResolvedValueOnce({ data: lesson, });
  hook.rerender({ id: '0', });
  await waitFor(() => { expect(hook.result.current.lesson).toEqual(lesson); });
  expect($api.get).toHaveBeenCalledTimes(3);
});

test.each([
  [undefined, '0'], ['12', undefined], ['abc', '0'], ['12', '-1'],
  ['12', 'abc'], ['12', '9007199254740992']
])('does not request invalid or unopened lessons (%s, %s)', (courseId, lessonId) => {
  const hook = renderHook(() => useLesson(courseId, lessonId), { wrapper: createWrapper(), });
  expect(hook.result.current.status).toBe('not-found');
  expect($api.get).not.toHaveBeenCalled();
});

test('reports missing lessons and retries network failures', async () => {
  jest.mocked($api.get).mockRejectedValueOnce({ isAxiosError: true, response: { status: 404, }, });
  const hook = renderHook(() => useLesson('12', '0'), { wrapper: createWrapper(), });
  await waitFor(() => { expect(hook.result.current.status).toBe('not-found'); });
  jest.mocked($api.get).mockRejectedValueOnce(new Error('Offline'));
  act(() => { hook.result.current.retry(); });
  await waitFor(() => { expect(hook.result.current.status).toBe('error'); });
  jest.mocked($api.get).mockResolvedValueOnce({ data: lesson, });
  act(() => { hook.result.current.retry(); });
  await waitFor(() => { expect(hook.result.current.lesson).toEqual(lesson); });
});
