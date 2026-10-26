import { type ReactNode } from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { StoreProvider } from '~/app/providers/StoreProvider/ui/StoreProvider';
import { $api } from '~/shared/api/instance';
import Lesson from './Lesson';

const params: Record<string, string> = {};

jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ href, children, prefetch, ...props }: { href: string; children: ReactNode; prefetch?: boolean }) =>
    <a href={href} {...props}>{children}</a>,
}));

jest.mock('next/navigation', () => ({
  useParams: () => params,
}));

jest.mock('~/shared/api/instance', () => ({
  $api: { get: jest.fn(), },
  serverUrl: 'http://localhost:3001',
  getCourseImage: (id: number) => `http://localhost:3001/course-${id}.jpg`,
}));

jest.mock('~/features/CodePlayground/ui/CodeEditor', () => ({
  CodeEditor: ({ value, label, }: { value: string; label: string }) =>
    <textarea aria-label={label} value={value} readOnly />,
}));

const course = {
  id: 12,
  name: 'React lessons',
  author: 'Example Author',
  date: '2023-05-01',
  numberOfLessons: 3,
};

function openLesson (url: string) {
  const match = url.match(/\/course\/([^/]+)\/lesson\/([^/]+)/);
  params.courseId = match?.[1] ?? '';
  params.lessonId = match?.[2] ?? '';
  return render(<StoreProvider><Lesson /></StoreProvider>);
}

test('direct lesson visits load their course and display a human lesson number', async () => {
  jest.mocked($api.get).mockResolvedValueOnce({ data: course, })
    .mockResolvedValueOnce({ data: { title: 'Lesson 3', blocks: [], }, });
  openLesson('/course/12/lesson/2');
  const heading = await screen.findByRole('heading', { name: 'React lessons. Lesson 3', });
  expect(heading).toBeInTheDocument();
  expect(screen.getByRole('link', { name: /view course/i, })).toHaveAttribute('href', '/course/12');
  await waitFor(() => { expect($api.get).toHaveBeenCalledTimes(2); });
  expect($api.get).toHaveBeenLastCalledWith('/courses/12/lessons/2', expect.any(Object));
});

test('renders lesson blocks with the editor open and a separate reference answer', async () => {
  jest.mocked($api.get).mockResolvedValueOnce({ data: course, }).mockResolvedValueOnce({
    data: {
      title: 'Lesson 1. React lessons',
      blocks: [
        { type: 'text', heading: 'Step 1', body: 'Read the example.', },
        { type: 'video', poster: 'course-12.jpg', title: 'Clip 1', caption: 'Store a value.', },
        { type: 'code', language: 'javascript', code: 'console.log(1);', },
        { type: 'console', command: 'node lesson-1.js', output: 'React lessons — step 1', },
        { type: 'picture', src: 'course-12.jpg', alt: 'React lessons figure', }
      ],
    },
  });
  openLesson('/course/12/lesson/0');
  expect(await screen.findByRole('heading', { name: 'Step 1', })).toBeInTheDocument();
  expect(screen.getByRole('img', { name: 'React lessons figure', }))
    .toHaveAttribute('src', 'http://localhost:3001/course-12.jpg');
  expect(await screen.findByRole('textbox', { name: 'Code editor', }))
    .toHaveValue('console.log(1);');
  expect(screen.getByLabelText('Expected output')).not.toBeVisible();
  fireEvent.click(screen.getByText('Expected output'));
  expect(screen.getByText('React lessons — step 1')).toBeInTheDocument();
});

test('rejects a lesson index outside the selected course', async () => {
  jest.mocked($api.get).mockResolvedValue({ data: course, });
  openLesson('/course/12/lesson/99');
  expect(await screen.findByRole('heading', { name: /lesson not found/i, })).toBeInTheDocument();
  expect($api.get).toHaveBeenCalledTimes(1);
});

test('uses the actual lesson title for the page heading and outline', async () => {
  jest.mocked($api.get).mockResolvedValueOnce({
    data: {
      ...course,
      lessons: [{ title: '1. Your first JavaScript program', }],
    },
  }).mockResolvedValueOnce({ data: { title: '1. Your first JavaScript program', blocks: [], }, });
  openLesson('/course/12/lesson/0');
  expect(await screen.findByRole('heading', { level: 1, name: 'Your first JavaScript program', }))
    .toBeInTheDocument();
  expect(screen.getByRole('link', { name: /01 Your first JavaScript program/i, }))
    .toHaveAttribute('aria-current', 'page');
});

test('keeps the outline visible while loading and retries a failed lesson request', async () => {
  jest.mocked($api.get).mockResolvedValueOnce({
    data: { ...course, lessons: [{ title: '1. On-demand lesson', }], },
  }).mockRejectedValueOnce(new Error('Offline'));
  openLesson('/course/12/lesson/0');
  expect(await screen.findByRole('alert')).toHaveTextContent('Could not load this lesson');
  expect(screen.getByRole('link', { name: /01 On-demand lesson/i, })).toBeVisible();
  jest.mocked($api.get).mockResolvedValueOnce({
    data: {
      title: 'On-demand lesson',
      blocks: [{ type: 'text', heading: 'Loaded', body: 'Body from the lesson endpoint', }],
    },
  });
  fireEvent.click(screen.getByRole('button', { name: 'Try again', }));
  expect(await screen.findByText('Body from the lesson endpoint')).toBeVisible();
  expect($api.get).toHaveBeenCalledTimes(3);
});

test('shows a lesson-specific not-found state if a stored lesson disappears', async () => {
  jest.mocked($api.get).mockResolvedValueOnce({ data: course, })
    .mockRejectedValueOnce({ isAxiosError: true, response: { status: 404, }, });
  openLesson('/course/12/lesson/0');
  expect(await screen.findByRole('heading', { level: 2, name: 'Lesson not found', }))
    .toBeVisible();
});
