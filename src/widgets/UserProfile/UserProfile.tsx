import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import Link from 'next/link';
import { accountErrorKey, useAccount } from '~/entities/Account/AccountProvider';
import '~/widgets/AccountForm/account.scss';

const UserProfile = () => {
  const { t, } = useTranslation();
  const account = useAccount();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const logout = async () => {
    setBusy(true);
    setError('');
    try {
      await account.logout();
    } catch (cause) {
      setError(accountErrorKey(cause));
    } finally {
      setBusy(false);
    }
  };
  return <section className='account-page'>
    <div className='account-intro'>
      <p className='eyebrow'>{t('brand-name')}</p>
      <h1>{t('account-view')}</h1>
      <p>{t('account-profile-intro')}</p>
      <div className='account-links'><Link className='action' href='/courses'>
        {t('all-courses')}
      </Link></div>
    </div>
    <div className='account-panel'>
      {account.loading
        ? <p role='status'>{t('account-loading')}</p>
        : account.error
          ? <>
          <p role='alert'>{t('account-unavailable')}</p>
          <button className='action' onClick={() => { void account.refresh(); }}>
            {t('account-retry')}
          </button>
        </>
          : account.user
            ? <>
          <h2>{account.user.name}</h2>
          <dl><dt>{t('account-email')}</dt><dd>{account.user.email}</dd></dl>
          {error && <p role='alert'>{t(error)}</p>}
          <button className='action action-secondary' onClick={logout} disabled={busy}>
            {t(busy ? 'account-working' : 'account-sign-out')}
          </button>
        </>
            : <>
          <h2>{t('account-sign-in-required')}</h2>
          <div className='account-links'>
            <Link className='action' href='/login'>{t('account-sign-in')}</Link>
            <Link className='action action-secondary' href='/register'>{t('account-create')}</Link>
          </div>
        </>}
    </div>
  </section>;
};
export default UserProfile;
