import { type ReactNode } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { StoreProvider } from '~/app/providers/StoreProvider/ui/StoreProvider';
import { $api } from '~/shared/api/instance';
import Lesson from './Lesson';

const params: Record<string, string> = {};

jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ href, children, ...props }: { href: string; children: ReactNode }) =>
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
  jest.mocked($api.get).mockResolvedValue({ data: course, });
  openLesson('/course/12/lesson/2');
  const heading = await screen.findByRole('heading', { name: 'React lessons. Lesson 3', });
  expect(heading).toBeInTheDocument();
  expect(screen.getByRole('link', { name: /view course/i, })).toHaveAttribute('href', '/course/12');
});

test('renders lesson blocks and reveals the simulated console output', async () => {
  jest.mocked($api.get).mockResolvedValue({
    data: {
      ...course,
      lessons: [{
        title: 'Lesson 1. React lessons',
        blocks: [
          { type: 'text', heading: 'Step 1', body: 'Read the example.', },
          { type: 'video', poster: 'course-12.jpg', title: 'Clip 1', caption: 'Store a value.', },
          { type: 'code', language: 'javascript', code: 'console.log(1);', },
          { type: 'console', command: 'node lesson-1.js', output: 'React lessons — step 1', },
          { type: 'picture', src: 'course-12.jpg', alt: 'React lessons figure', }
        ],
      }],
    },
  });
  openLesson('/course/12/lesson/0');
  expect(await screen.findByRole('heading', { name: 'Step 1', })).toBeInTheDocument();
  expect(screen.getByRole('img', { name: 'React lessons figure', }))
    .toHaveAttribute('src', 'http://localhost:3001/course-12.jpg');
  expect(screen.getByText('console.log(1);')).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Run', }));
  expect(screen.getByText('React lessons — step 1')).toBeInTheDocument();
});

test('rejects a lesson index outside the selected course', async () => {
  jest.mocked($api.get).mockResolvedValue({ data: course, });
  openLesson('/course/12/lesson/99');
  expect(await screen.findByRole('heading', { name: /lesson not found/i, })).toBeInTheDocument();
});
