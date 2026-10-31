import type { NextRequest } from 'next/server';
import { LANGUAGE_COOKIE, normalizeLanguage } from '~/shared/config/language';
import en from '../../../../../public/locales/en.json';
import ru from '../../../../../public/locales/ru.json';

export const dynamic = 'force-dynamic';
const headers = { 'Cache-Control': 'private, no-store', Vary: 'Cookie', };

// Optional session discovery keeps ordinary guest visits successful. Protected
// /api/auth/me and sign-in requests retain their backend authentication rules.
export async function GET (request: NextRequest) {
  const session = request.cookies.get('learning_session')?.value ?? '';
  if (!/^[a-f0-9]{64}$/.test(session)) return Response.json({ user: null, }, { headers, });

  try {
    const origin = process.env.SERVER_URL || 'http://127.0.0.1:3001';
    const response = await fetch(new URL('/api/auth/me', origin).href, {
      headers: { Accept: 'application/json', Cookie: `learning_session=${session}`, },
      cache: 'no-store',
      redirect: 'error',
      signal: AbortSignal.timeout(8000),
    });
    if (response.status === 401) {
      await response.body?.cancel();
      return Response.json({ user: null, }, { headers, });
    }
    if (!response.ok) {
      await response.body?.cancel();
      throw new Error('Session service unavailable.');
    }
    const { user, } = await response.json() as {
      user?: { id?: unknown; name?: unknown; email?: unknown };
    };
    if (!user || typeof user.id !== 'string' || typeof user.name !== 'string' ||
        typeof user.email !== 'string') throw new Error('Invalid session response.');
    const account = { id: user.id, name: user.name, email: user.email, };
    return Response.json({ user: account, }, { headers, });
  } catch {
    const language = normalizeLanguage(request.cookies.get(LANGUAGE_COOKIE)?.value);
    const messages = language === 'ru' ? ru : en;
    return Response.json({ error: messages.translation['account-session-error'], },
      { status: 502, headers, });
  }
}
