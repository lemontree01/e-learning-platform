import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { features } from '~/shared/config/features';
import './accountPreview.scss';

export function AccountPreview ({ title, }: { title: string }) {
  const { t, } = useTranslation();
  return <section className='account-preview'>
    <div><p className='eyebrow'>{t('brand-name')} / {t('public-demo')}</p>
      <h1>{title}</h1><p role='status'>{t('accounts-unavailable')}</p>
      <div className='account-actions'>
        <Link href='/courses' className='action'>{t('all-courses')} →</Link>
        <Link href={features.playground ? '/home#observatory' : '/about'}
          className='action action-secondary'>
          {t(features.playground ? 'try-observatory' : 'about-platform')}
        </Link>
      </div>
    </div>
    <div className='account-art' aria-hidden='true'>
      <span className='account-orbit' /><span className='account-orbit second-orbit' />
      <span className='account-code'>{'{ }'}</span>
      <span className='eyebrow'>{t('learning-space-label')}</span>
    </div>
  </section>;
}
