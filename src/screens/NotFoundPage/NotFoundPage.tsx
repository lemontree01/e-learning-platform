'use client';

import Link from 'next/link';
import { useTranslation } from 'react-i18next';

export default function NotFoundPage () {
  const { t, } = useTranslation();
  return (
    <section>
      <div className='state-panel'>
        <p className='eyebrow'>404</p>
        <h1>{t('page-not-found')}</h1>
        <p>{t('page-not-found-description')}</p>
        <Link href='/courses' className='action'>{t('back-to-courses')}</Link>
      </div>
    </section>
  );
}
