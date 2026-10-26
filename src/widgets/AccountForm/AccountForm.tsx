import { type FormEvent, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { accountErrorKey, useAccount } from '~/entities/Account/AccountProvider';
import './account.scss';

export function AccountForm ({ mode, }: { mode: 'register' | 'login' }) {
  const { t, } = useTranslation();
  const account = useAccount();
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const errorRef = useRef<HTMLParagraphElement>(null);
  const register = mode === 'register';
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (busy) return;
    const data = new FormData(event.currentTarget);
    const password = String(data.get('password') ?? '');
    if (register && password !== data.get('confirmation')) {
      setError('account-mismatch');
      requestAnimationFrame(() => errorRef.current?.focus());
      return;
    }
    setBusy(true);
    setError('');
    try {
      await account.authenticate(mode, {
        email: String(data.get('email') ?? ''),
        password,
        ...(register ? { name: String(data.get('name') ?? ''), } : {}),
      });
      router.push('/profile');
    } catch (cause) {
      setError(accountErrorKey(cause));
      requestAnimationFrame(() => errorRef.current?.focus());
    } finally {
      setBusy(false);
    }
  };

  return <section className='account-page'>
    <div className='account-intro'>
      <p className='eyebrow'>{t('brand-name')}</p>
      <h1>{t(register ? 'register-title' : 'login-title')}</h1>
      <p>{t(register ? 'account-register-intro' : 'account-login-intro')}</p>
    </div>
    <div className='account-panel'>
      {account.user
        ? <>
        <h2>{account.user.name}</h2>
        <Link className='action' href='/profile'>{t('account-view')}</Link>
      </>
        : <form onSubmit={submit} aria-busy={busy}>
        <h2>{t(register ? 'account-create' : 'account-sign-in')}</h2>
        {register && <label htmlFor='account-name'>{t('account-name')}
          <input id='account-name' name='name' autoComplete='name' required maxLength={80}
            disabled={busy} />
        </label>}
        <label htmlFor='account-email'>{t('account-email')}
          <input id='account-email' name='email' type='email' autoComplete='email' required
            maxLength={254} disabled={busy} />
        </label>
        <label htmlFor='account-password'>{t('account-password')}
          <input id='account-password' name='password' type='password' required minLength={15}
            maxLength={128} autoComplete={register ? 'new-password' : 'current-password'}
            aria-describedby='password-hint' disabled={busy} />
        </label>
        <p id='password-hint' className='account-hint'>{t('account-password-hint')}</p>
        {register && <label htmlFor='account-confirmation'>{t('account-confirm')}
          <input id='account-confirmation' name='confirmation' type='password'
            autoComplete='new-password' required maxLength={128} disabled={busy} />
        </label>}
        {error && <p role='alert' tabIndex={-1} ref={errorRef}>{t(error)}</p>}
        <button className='action' type='submit' disabled={busy}>
          {t(busy ? 'account-working' : register ? 'account-create' : 'account-sign-in')}
        </button>
        <p>{t(register ? 'account-already' : 'account-new')}{' '}
          <Link href={register ? '/login' : '/register'}>
            {t(register ? 'account-sign-in' : 'account-create')}
          </Link>
        </p>
      </form>}
    </div>
  </section>;
}
