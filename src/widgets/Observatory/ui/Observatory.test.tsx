import { act, fireEvent, render, screen } from '@testing-library/react';
import { type ReactNode } from 'react';
import { Observatory } from './Observatory';

jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ href, children, ...props }: { href: string; children: ReactNode }) =>
    <a href={href} {...props}>{children}</a>,
}));

function openExperiment () {
  return render(<Observatory />);
}

test('scrubbing exposes the stale result and cancellation fixes it without a real request', () => {
  openExperiment();
  const timeline = screen.getByRole('slider', { name: 'Experiment timeline', });
  fireEvent.change(timeline, { target: { value: '1200', }, });
  expect(screen.getByRole('status')).toHaveTextContent('Older response overwrote');
  fireEvent.click(screen.getByRole('checkbox', { name: 'Cancel older request', }));
  expect(screen.getByRole('status')).toHaveTextContent('The latest result is on screen');
  fireEvent.change(timeline, { target: { value: '0', }, });
  expect(screen.getByRole('status')).toHaveTextContent('Press play');
});

test('pause freezes playback and unmount cancels the animation', () => {
  jest.useFakeTimers();
  const view = openExperiment();
  fireEvent.click(screen.getByRole('button', { name: 'Play experiment', }));
  act(() => { jest.advanceTimersByTime(1000); });
  const timeline = screen.getByRole<HTMLInputElement>('slider');
  expect(Number(timeline.value)).toBeGreaterThan(0);
  fireEvent.click(screen.getByRole('button', { name: 'Pause experiment', }));
  const paused = timeline.value;
  act(() => { jest.advanceTimersByTime(1000); });
  expect(timeline.value).toBe(paused);
  fireEvent.click(screen.getByRole('button', { name: 'Play experiment', }));
  view.unmount();
  expect(jest.getTimerCount()).toBe(0);
  jest.useRealTimers();
});
