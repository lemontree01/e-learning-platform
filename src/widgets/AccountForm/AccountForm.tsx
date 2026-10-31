import { type FormEvent, type SyntheticEvent, useRef, useState } from 'react';
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
  // The browser's own bubbles follow the browser language; speak the interface language instead.
  const explain = (event: SyntheticEvent<HTMLInputElement>) => {
    const { validity, minLength, } = event.currentTarget;
    event.currentTarget.setCustomValidity(validity.valueMissing
      ? t('form-required')
      : validity.typeMismatch
        ? t('form-email')
        : validity.tooShort ? t('form-too-short', { min: minLength, }) : '');
  };
  const edited = (event: SyntheticEvent<HTMLInputElement>) => {
    event.currentTarget.setCustomValidity('');
  };
  const checked = { onInvalid: explain, onInput: edited, };
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
            disabled={busy} {...checked} />
        </label>}
        <label htmlFor='account-email'>{t('account-email')}
          <input id='account-email' name='email' type='email' autoComplete='email' required
            maxLength={254} disabled={busy} {...checked} />
        </label>
        <label htmlFor='account-password'>{t('account-password')}
          {/* Only new passwords have a minimum; signing in accepts whatever the account has. */}
          <input id='account-password' name='password' type='password' required
            minLength={register ? 15 : undefined} maxLength={128}
            autoComplete={register ? 'new-password' : 'current-password'}
            aria-describedby={register ? 'password-hint' : undefined} disabled={busy}
            {...checked} />
        </label>
        {register && <p id='password-hint' className='account-hint'>
          {t('account-password-hint')}
        </p>}
        {register && <label htmlFor='account-confirmation'>{t('account-confirm')}
          <input id='account-confirmation' name='confirmation' type='password'
            autoComplete='new-password' required maxLength={128} disabled={busy} {...checked} />
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
