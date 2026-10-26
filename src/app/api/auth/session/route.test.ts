/** @jest-environment node */
import { NextRequest } from 'next/server';
import { GET } from './route';

const session = 'a'.repeat(64);
const user = { id: 'learner', name: 'Learner', email: 'learner@example.test', };
const request = (cookie = '') => new NextRequest('http://localhost/api/auth/session', {
  headers: { Cookie: cookie, },
});

afterEach(() => { jest.restoreAllMocks(); });

test.each(['', 'learning_session=invalid', 'language=en'])('guest session: %s', async cookie => {
  const fetch = jest.spyOn(global, 'fetch');
  const response = await GET(request(cookie));
  expect(response.status).toBe(200);
  expect(await response.json()).toEqual({ user: null, });
  expect(response.headers.get('cache-control')).toContain('no-store');
  expect(response.headers.get('vary')).toBe('Cookie');
  expect(fetch).not.toHaveBeenCalled();
});

test('valid sessions forward only the session cookie and return safe account fields', async () => {
  const fetch = jest.spyOn(global, 'fetch').mockResolvedValue(Response.json({
    user: { ...user, password_hash: 'never-forward', },
  }));
  const cookies = `language=en; learning_session=${session}; unrelated=private`;
  const response = await GET(request(cookies));
  expect(response.status).toBe(200);
  expect(await response.json()).toEqual({ user, });
  expect(fetch).toHaveBeenCalledWith(
    expect.stringMatching(/\/api\/auth\/me$/),
    expect.objectContaining({
      headers: { Accept: 'application/json', Cookie: `learning_session=${session}`, },
      cache: 'no-store',
      redirect: 'error',
    })
  );
  expect(response.headers.get('cache-control')).toContain('no-store');
});

test('expired and revoked sessions return a successful guest response', async () => {
  jest.spyOn(global, 'fetch').mockResolvedValue(Response.json(
    { error: 'Sign in.', }, { status: 401, }
  ));
  const response = await GET(request(`learning_session=${session}`));
  expect(response.status).toBe(200);
  expect(await response.json()).toEqual({ user: null, });
  expect(response.headers.get('set-cookie')).toBeNull();
});

test.each([403, 404, 500, 503])('backend HTTP %s remains an error', async status => {
  jest.spyOn(global, 'fetch').mockResolvedValue(new Response('private details', { status, }));
  const response = await GET(request(`learning_session=${session}`));
  expect(response.status).toBe(502);
  expect(await response.json()).toEqual({ error: 'Unable to load your account.', });
  expect(response.headers.get('cache-control')).toContain('no-store');
});

test('network failures remain visible without exposing internal error details', async () => {
  jest.spyOn(global, 'fetch').mockRejectedValue(new Error('private connection details'));
  const response = await GET(request(`learning_session=${session}`));
  expect(response.status).toBe(502);
  expect(await response.json()).toEqual({ error: 'Unable to load your account.', });
});

test('malformed account responses stay errors', async () => {
  jest.spyOn(global, 'fetch').mockResolvedValue(Response.json({ user: { id: 'incomplete', }, }));
  expect((await GET(request(`learning_session=${session}`))).status).toBe(502);
});
