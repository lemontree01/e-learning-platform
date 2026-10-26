import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { $api } from '~/shared/api/instance';
import { AccountProvider, useAccount } from './AccountProvider';

jest.mock('~/shared/api/instance', () => ({
  $api: { get: jest.fn(), post: jest.fn(), },
}));
function Consumer () {
  const account = useAccount();
  return <>
    <span>{account.user?.name ?? 'Guest'}</span>
    <span>{account.loading ? 'Loading' : 'Ready'}</span>
    {account.error && <span>Account unavailable</span>}
    <button onClick={() => {
      void account.authenticate('login', { email: 'new@example.test', password: 'a-test-passphrase', });
    }}>Sign in</button>
  </>;
}

test('signed-out visitors use the optional session endpoint without an account error', async () => {
  jest.mocked($api.get).mockResolvedValue({ data: { user: null, }, });
  render(<AccountProvider><Consumer /></AccountProvider>);
  expect(await screen.findByText('Ready')).toBeVisible();
  expect(screen.getByText('Guest')).toBeVisible();
  expect(screen.queryByText('Account unavailable')).not.toBeInTheDocument();
  expect($api.get).toHaveBeenCalledWith('/auth/session');
});

test('session service failures remain visible', async () => {
  jest.mocked($api.get).mockRejectedValue(new Error('Service unavailable'));
  render(<AccountProvider><Consumer /></AccountProvider>);
  await waitFor(() => { expect(screen.getByText('Account unavailable')).toBeVisible(); });
  expect(screen.getByText('Ready')).toBeVisible();
});
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
