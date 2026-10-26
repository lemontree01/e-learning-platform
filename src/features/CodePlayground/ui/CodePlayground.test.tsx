import { fireEvent, render, screen } from '@testing-library/react';
import CodePlayground from './CodePlayground';
import { startRun } from '../model/runner';

jest.mock('../model/runner', () => ({ startRun: jest.fn(), }));
jest.mock('./CodeEditor', () => ({
  CodeEditor: ({ value, onChange, label, }: {
    value: string; onChange: (value: string) => void; label: string;
  }) => <textarea aria-label={label} value={value} onChange={event => { onChange(event.target.value); }} />,
}));

test('runs edited code and input and renders output as text', async () => {
  jest.mocked(startRun).mockReturnValue({
    stop: jest.fn(), result: Promise.resolve({ status: 'completed', output: '<script>text only</script>', }),
  });
  render(<CodePlayground initialLanguage="javascript" initialCode="console.log(1)" />);
  fireEvent.change(screen.getByRole('textbox', { name: 'Code editor', }), {
    target: { value: 'console.log(prompt())', },
  });
  fireEvent.click(screen.getByText('Program input'));
  fireEvent.change(screen.getByLabelText('Input (one line per prompt)'), { target: { value: '42', }, });
  fireEvent.click(screen.getByRole('button', { name: 'Run code', }));
  expect(await screen.findByText('<script>text only</script>')).toBeVisible();
  expect(startRun).toHaveBeenCalledWith('javascript', 'console.log(prompt())', '42', expect.any(Function));
});

test('stop cancels an active run and reset restores the lesson example', () => {
  const stop = jest.fn();
  jest.mocked(startRun).mockReturnValue({ stop, result: new Promise(() => {}), });
  render(<CodePlayground initialLanguage="javascript" initialCode="console.log(1)" />);
  fireEvent.change(screen.getByRole('textbox', { name: 'Code editor', }), {
    target: { value: 'while (true) {}', },
  });
  fireEvent.click(screen.getByRole('button', { name: 'Run code', }));
  fireEvent.click(screen.getByRole('button', { name: 'Stop', }));
  expect(stop).toHaveBeenCalled();
  expect(screen.getByRole('status')).toHaveTextContent('Stopped');
  fireEvent.click(screen.getByRole('button', { name: 'Reset code', }));
  expect(screen.getByRole('textbox', { name: 'Code editor', })).toHaveValue('console.log(1)');
});

test('language switches choose a starter and unmount stops execution', () => {
  const stop = jest.fn();
  jest.mocked(startRun).mockReturnValue({ stop, result: new Promise(() => {}), });
  const { unmount, } = render(<CodePlayground initialLanguage="javascript" initialCode="1"
    starters={{ python: 'print("From the lesson API")\n', }} />);
  fireEvent.change(screen.getByRole('combobox', { name: 'Language', }), { target: { value: 'python', }, });
  expect(screen.getByRole('textbox', { name: 'Code editor', })).toHaveValue('print("From the lesson API")\n');
  fireEvent.change(screen.getByRole('textbox', { name: 'Code editor', }), { target: { value: 'edited', }, });
  fireEvent.click(screen.getByRole('button', { name: 'Reset code', }));
  expect(screen.getByRole('textbox', { name: 'Code editor', })).toHaveValue('print("From the lesson API")\n');
  fireEvent.click(screen.getByRole('button', { name: 'Run code', }));
  unmount();
  expect(stop).toHaveBeenCalled();
});

test('older lesson blocks use an empty editor when no alternate starter is supplied', () => {
  render(<CodePlayground initialLanguage="javascript" initialCode="original" />);
  fireEvent.change(screen.getByRole('combobox', { name: 'Language', }), { target: { value: 'python', }, });
  expect(screen.getByRole('textbox', { name: 'Code editor', })).toHaveValue('');
  fireEvent.change(screen.getByRole('combobox', { name: 'Language', }), { target: { value: 'javascript', }, });
  expect(screen.getByRole('textbox', { name: 'Code editor', })).toHaveValue('original');
});

test('copy uses the edited code and reference output stays separate from execution', async () => {
  const writeText = jest.fn().mockResolvedValue(undefined);
  Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText, }, });
  render(<CodePlayground initialLanguage="javascript" initialCode="console.log(1)"
    expected={{ command: 'node example.js', output: '1', }} />);
  expect(screen.getByLabelText('Expected output').closest('details')).not.toHaveAttribute('open');
  expect(screen.getByTestId('code-output')).toHaveTextContent('Run your code');
  fireEvent.change(screen.getByRole('textbox', { name: 'Code editor', }), {
    target: { value: 'console.log(42)', },
  });
  fireEvent.click(screen.getByRole('button', { name: 'Copy code', }));
  expect(await screen.findByRole('button', { name: 'Copied', })).toBeVisible();
  expect(writeText).toHaveBeenCalledWith('console.log(42)');
  expect(startRun).not.toHaveBeenCalled();
});
