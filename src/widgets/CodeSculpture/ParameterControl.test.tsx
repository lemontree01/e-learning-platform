import { fireEvent, render, screen } from '@testing-library/react';
import { useState } from 'react';
import { ParameterControl } from './ParameterControl';

function Control () {
  const [value, setValue] = useState(16);
  return <ParameterControl name="folds" value={value} onChange={setValue} disabled={false} />;
}

test('code and slider stay synchronized without preventing intermediate typing', () => {
  render(<Control />);
  const number = screen.getByRole('spinbutton');
  const slider = screen.getByRole('slider');
  fireEvent.change(number, { target: { value: '1', }, });
  expect(number).toHaveValue(1);
  fireEvent.change(number, { target: { value: '18', }, });
  expect(slider).toHaveValue('18');
  fireEvent.change(slider, { target: { value: '24', }, });
  expect(number).toHaveValue(24);
  fireEvent.change(number, { target: { value: '99', }, });
  fireEvent.blur(number);
  expect(number).toHaveValue(32);
  expect(slider).toHaveValue('32');
  fireEvent.change(number, { target: { value: '', }, });
  fireEvent.blur(number);
  expect(number).toHaveValue(32);
});

test('controls are disabled until a renderer is ready', () => {
  render(<ParameterControl name="twist" value={120} onChange={jest.fn()} disabled />);
  expect(screen.getByRole('spinbutton')).toBeDisabled();
  expect(screen.getByRole('slider')).toBeDisabled();
});
