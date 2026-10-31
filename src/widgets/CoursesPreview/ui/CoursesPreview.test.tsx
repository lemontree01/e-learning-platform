import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import i18n from 'i18next';
import { createReduxStore } from '~/app/providers/StoreProvider/config/store';
import { $api } from '~/shared/api/instance';
import { type Course } from '~/entities/Course';
import { CoursesPreview } from './CoursesPreview';

let mockSearchParams = new URLSearchParams();
jest.mock('next/navigation', () => ({
  useSearchParams: () => mockSearchParams, useRouter: () => ({ push: jest.fn(), }),
}));
jest.mock('~/shared/api/instance', () => ({ $api: { get: jest.fn(), }, }));

const course: Course = {
  id: 1, name: 'HTML foundations', author: 'Example Author', date: '2026-10-26', numberOfLessons: 0,
};
const result: Course = { ...course, id: 2, name: 'TypeScript foundations', };

beforeEach(async () => {
  mockSearchParams = new URLSearchParams();
  jest.mocked($api.get).mockReset();
  i18n.addResourceBundle('ru', 'translation', { lesson: 'Lesson', });
  await i18n.changeLanguage('en');
});

test('returning home uses its complete server catalog after a filtered search', async () => {
  const store = createReduxStore();
  mockSearchParams = new URLSearchParams({ search: 'TypeScript', });
  jest.mocked($api.get).mockResolvedValueOnce({ data: [result], });
  const view = render(<Provider store={store}><CoursesPreview /></Provider>);
  await screen.findByRole('heading', { name: result.name, });
  mockSearchParams = new URLSearchParams();
  view.rerender(<Provider store={store}>
    <CoursesPreview featured seed={{ language: 'eng', courses: [course, result], }} />
  </Provider>);
  expect(screen.getByRole('heading', { name: course.name, })).toBeVisible();
  expect(screen.getByRole('heading', { name: result.name, })).toBeVisible();
  expect($api.get).toHaveBeenCalledTimes(1);
});

test('the home row shows three courses after the featured one, with or without lessons', () => {
  const catalog = [0, 1, 2, 3, 4].map((id) => ({
    ...course, id, name: `Course ${id}`, numberOfLessons: id % 2 ? 0 : 8,
  }));
  render(<Provider store={createReduxStore()}>
    <CoursesPreview featured seed={{ language: 'eng', courses: catalog, }} />
  </Provider>);
  expect(screen.getAllByRole('heading', { level: 3, }).map((heading) => heading.textContent))
    .toEqual(['Course 1', 'Course 2', 'Course 3']);
});

test('language changes hide old cards and restore the correct seed', async () => {
  const store = createReduxStore();
  const translated = { ...course, name: 'Russian course title', };
  let resolveRequest: (value: { data: Course[] }) => void = () => {};
  jest.mocked($api.get).mockImplementationOnce(async () => await new Promise(resolve => {
    resolveRequest = resolve;
  }));
  render(<Provider store={store}>
    <CoursesPreview featured seed={{ language: 'eng', courses: [course], }} />
  </Provider>);
  expect(screen.getByRole('heading', { name: course.name, })).toBeVisible();
  await act(async () => { await i18n.changeLanguage('ru'); });
  expect(screen.queryByRole('heading', { name: course.name, })).not.toBeInTheDocument();
  await act(async () => { resolveRequest({ data: [translated], }); });
  expect(screen.getByRole('heading', { name: translated.name, })).toBeVisible();
  await act(async () => { await i18n.changeLanguage('en'); });
  expect(screen.getByRole('heading', { name: course.name, })).toBeVisible();
  expect(screen.queryByRole('heading', { name: translated.name, })).not.toBeInTheDocument();
  expect($api.get).toHaveBeenCalledTimes(1);
});

test('a new query hides old results and retry shows loading before fresh results', async () => {
  const store = createReduxStore();
  jest.mocked($api.get).mockResolvedValueOnce({ data: [course], });
  const view = render(<Provider store={store}><CoursesPreview /></Provider>);
  await screen.findByRole('heading', { name: course.name, });
  let rejectRequest: (error: Error) => void = () => {};
  jest.mocked($api.get).mockImplementationOnce(async () => await new Promise((_resolve, reject) => {
    rejectRequest = reject;
  }));
  mockSearchParams = new URLSearchParams({ search: 'TypeScript', });
  view.rerender(<Provider store={store}><CoursesPreview /></Provider>);
  expect(screen.queryByRole('heading', { name: course.name, })).not.toBeInTheDocument();
  expect(view.container.querySelector('[aria-busy="true"]')).toBeInTheDocument();
  await act(async () => { rejectRequest(new Error('Offline')); });
  await screen.findByRole('alert');
  let resolveRequest: (value: { data: Course[] }) => void = () => {};
  jest.mocked($api.get).mockImplementationOnce(async () => await new Promise(resolve => {
    resolveRequest = resolve;
  }));
  fireEvent.click(screen.getByRole('button', { name: 'Try again', }));
  expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  expect(view.container.querySelector('[aria-busy="true"]')).toBeInTheDocument();
  await act(async () => { resolveRequest({ data: [result], }); });
  await waitFor(() => {
    expect(screen.getByRole('heading', { name: result.name, })).toBeVisible();
  });
  expect(screen.queryByRole('heading', { name: course.name, })).not.toBeInTheDocument();
});

test('an empty search result never falls back to a server catalog', async () => {
  const store = createReduxStore();
  mockSearchParams = new URLSearchParams({ search: 'no matches', });
  jest.mocked($api.get).mockResolvedValueOnce({ data: [], });
  render(<Provider store={store}>
    <CoursesPreview seed={{ language: 'eng', courses: [course], }} />
  </Provider>);
  await screen.findByText('No courses found. Try another search.');
  expect(screen.queryByRole('heading', { name: course.name, })).not.toBeInTheDocument();
});
