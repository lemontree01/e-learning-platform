import { fireEvent, render, screen } from '@testing-library/react';
import RouteError from './error';
import NotFound from '~/screens/NotFoundPage/NotFoundPage';

test('route failures offer recovery without exposing error details', () => {
  const reset = jest.fn();
  render(<RouteError error={new Error('private upstream details')} reset={reset} />);
  expect(screen.getByRole('alert')).toHaveTextContent('Something went wrong');
  expect(screen.queryByText('private upstream details')).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Try again', }));
  expect(reset).toHaveBeenCalledTimes(1);
  expect(screen.getByRole('link', { name: 'Home', })).toHaveAttribute('href', '/home');
});

test('unknown routes explain the missing page and provide a way back to the catalog', () => {
  render(<NotFound />);
  expect(screen.getByRole('heading', { level: 1, })).toHaveTextContent('Page not found');
  expect(screen.getByRole('link', { name: 'Back to courses', }))
    .toHaveAttribute('href', '/courses');
});
