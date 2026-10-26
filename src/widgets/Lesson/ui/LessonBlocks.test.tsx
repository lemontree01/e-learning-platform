import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { LessonBlocks } from './LessonBlocks';

test('copies the displayed code and reports success', async () => {
  const writeText = jest.fn().mockResolvedValue(undefined);
  Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText, }, });
  render(
    <LessonBlocks blocks={[{ type: 'code', language: 'javascript', code: 'console.log(42);', }]} />
  );
  fireEvent.click(screen.getByRole('button', { name: 'Copy code', }));
  expect(await screen.findByRole('button', { name: 'Copied', })).toBeInTheDocument();
  expect(writeText).toHaveBeenCalledWith('console.log(42);');
});

test('clipboard failure leaves selectable code and explains how to copy manually', async () => {
  Object.defineProperty(navigator, 'clipboard', {
    configurable: true,
    value: {
      writeText: jest.fn().mockRejectedValue(new Error('Denied')),
    },
  });
  render(
    <LessonBlocks
      blocks={[{ type: 'code', language: 'javascript', code: 'const answer = 42;', }]}
    />
  );
  fireEvent.click(screen.getByRole('button', { name: 'Copy code', }));
  await waitFor(() => {
    expect(screen.getByRole('status')).toHaveTextContent('Select the code to copy it manually.');
  });
  expect(screen.getByText('const answer = 42;')).toBeInTheDocument();
});
