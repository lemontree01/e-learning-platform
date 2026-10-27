import { act, fireEvent, render, screen } from '@testing-library/react';
import { CourseIndex } from './CourseIndex';

const course = {
  id: 0,
  name: 'JavaScript Fundamentals',
  author: 'Author',
  date: '2026-10-26',
  numberOfLessons: 2,
  lessons: [
    { title: '1. Your first JavaScript program', blocks: [], },
    { title: '2. Variables and value types', blocks: [], }
  ],
};

test('chapter links keep their destinations when switching to list view', async () => {
  await act(async () => { render(<CourseIndex course={course} />); });
  expect(
    screen.getByRole('link', { name: /01 Your first JavaScript program/i, })
  ).toHaveAttribute('href', '/course/0/lesson/0');
  fireEvent.click(screen.getByRole('button', { name: 'List view', }));
  expect(screen.getByRole('button', { name: 'List view', })).toHaveAttribute(
    'aria-pressed',
    'true'
  );
  expect(
    screen.getByRole('link', { name: /02 Variables and value types/i, })
  ).toHaveAttribute('href', '/course/0/lesson/1');
});

test('missing lesson metadata keeps a useful route and human lesson number', async () => {
  await act(async () => { render(<CourseIndex course={{ ...course, lessons: undefined, }} />); });
  expect(screen.getByRole('link', { name: /01 Lesson 1/i, })).toHaveAttribute(
    'href',
    '/course/0/lesson/0'
  );
});
