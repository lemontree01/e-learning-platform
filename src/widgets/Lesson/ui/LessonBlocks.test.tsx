import { render, screen } from '@testing-library/react';
import { LessonBlocks } from './LessonBlocks';

jest.mock('~/features/CodePlayground/ui/CodePlayground', () => ({
  __esModule: true,
  default: ({ initialCode, starters, expected, }: {
    initialCode: string; expected?: { command: string; output: string };
    starters?: { python?: string };
  }) => <div role="group" aria-label="Default editor">
    {initialCode}
    {starters?.python && <span>{starters.python}</span>}
    {expected && <span>{expected.output}</span>}
  </div>,
}));

test('runnable examples open directly and own their adjacent reference output', async () => {
  render(<LessonBlocks blocks={[
    { type: 'code', language: 'JavaScript', code: 'console.log(42)', starters: { python: 'print("API starter")', }, },
    { type: 'console', command: 'node lesson.js', output: 'reference answer', }
  ]} />);
  expect(await screen.findByRole('group', { name: 'Default editor', })).toBeVisible();
  expect(screen.getAllByText('reference answer')).toHaveLength(1);
  expect(screen.getByText('print("API starter")')).toBeVisible();
  expect(screen.queryByText('Try code')).not.toBeInTheDocument();
  expect(screen.queryByText('Expected output')).not.toBeInTheDocument();
});

test('unsupported code and standalone reference output remain available', () => {
  render(<LessonBlocks blocks={[
    { type: 'code', language: 'ruby', code: 'puts 42', },
    { type: 'console', command: 'ruby lesson.rb', output: '42', }
  ]} />);
  expect(screen.getByText('puts 42')).toBeVisible();
  expect(screen.getByRole('button', { name: 'Copy code', })).toBeEnabled();
  expect(screen.getByLabelText('Expected output').closest('details')).not.toHaveAttribute('open');
  expect(screen.queryByRole('group', { name: 'Default editor', })).not.toBeInTheDocument();
});
