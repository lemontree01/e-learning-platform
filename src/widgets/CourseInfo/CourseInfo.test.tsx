import { type ReactNode } from 'react';
import { render, screen } from '@testing-library/react';
import { StoreProvider } from '~/app/providers/StoreProvider/ui/StoreProvider';
import { $api } from '~/shared/api/instance';
import CourseInfo from './CourseInfo';

const params: { id?: string } = {};

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
  getCourseImage: (id: number) => `http://localhost:3001/course-${id}.jpg`,
}));

const course = {
  id: 12,
  name: 'The requested course',
  author: 'Example Author',
  date: '2023-05-01',
  numberOfLessons: 3,
};

function openCourse (url = '/course/12') {
  params.id = url.split('/').pop();
  return render(<StoreProvider><CourseInfo /></StoreProvider>);
}

beforeEach(() => {
  localStorage.clear();
});

test('loads the course from the URL instead of an unrelated cached course', async () => {
  localStorage.setItem('current-course', JSON.stringify({
    ...course, id: 0, name: 'Unrelated cached course',
  }));
  jest.mocked($api.get).mockResolvedValue({ data: course, });
  openCourse();
  expect(await screen.findByText(course.name)).toBeInTheDocument();
  expect(screen.queryByText('Unrelated cached course')).not.toBeInTheDocument();
  const lessonLink = screen.getByRole('link', { name: /part 1/i, });
  expect(lessonLink).toHaveAttribute('href', '/course/12/lesson/0');
});

test('a fresh direct visit works even with corrupt legacy storage', async () => {
  localStorage.setItem('current-course', '{broken-json');
  jest.mocked($api.get).mockResolvedValue({ data: course, });
  openCourse();
  expect(await screen.findByText(course.name)).toBeInTheDocument();
});

test('unknown course IDs show a useful not-found state', async () => {
  jest.mocked($api.get).mockRejectedValue({ isAxiosError: true, response: { status: 404, }, });
  openCourse('/course/9999');
  expect(await screen.findByRole('heading', { name: /course not found/i, })).toBeInTheDocument();
  const recoveryLink = screen.getByRole('link', { name: /back to courses/i, });
  expect(recoveryLink).toHaveAttribute('href', '/courses');
});
