import { act, fireEvent, render, screen } from '@testing-library/react';
import { $api } from '~/shared/api/instance';
import { AccountProvider, useAccount } from './AccountProvider';

jest.mock('~/shared/api/instance', () => ({
  $api: { get: jest.fn(), post: jest.fn(), },
}));
function Consumer () {
  const account = useAccount();
  return <>
    <span>{account.user?.name ?? 'Guest'}</span>
    <button onClick={() => {
      void account.authenticate('login', { email: 'new@example.test', password: 'a-test-passphrase', });
    }}>Sign in</button>
  </>;
}
test('a delayed initial account response cannot overwrite a newer sign-in', async () => {
  let finishRefresh: (value: unknown) => void = () => {};
  jest.mocked($api.get).mockReturnValue(new Promise(resolve => { finishRefresh = resolve; }));
  jest.mocked($api.post).mockResolvedValue({
    data: { user: { id: 'new', name: 'New account', email: 'new@example.test', }, },
  });
  render(<AccountProvider><Consumer /></AccountProvider>);
  fireEvent.click(screen.getByRole('button', { name: 'Sign in', }));
  expect(await screen.findByText('New account')).toBeVisible();
  await act(async () => {
    finishRefresh({ data: { user: { id: 'old', name: 'Old account', email: 'old@example.test', }, }, });
  });
  expect(screen.getByText('New account')).toBeVisible();
});
