import { useTranslation } from 'react-i18next';

export const ErrorPage = ({ onRetry, }: { onRetry?: () => void }) => {
  const { t, } = useTranslation();
  return (
    <section><div className='state-panel' role='alert'>
      <h1 className='heading'>{t('unexpected-error')}</h1>
      <p>{t('unexpected-error-description')}</p>
      {onRetry && <p><button type='button' className='action' onClick={onRetry}>
        {t('account-retry')}
      </button></p>}
      <a href='/home' className='action'>{t('home')}</a>
    </div></section>
  );
};
