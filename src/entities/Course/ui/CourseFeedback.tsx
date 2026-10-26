import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { type CourseLoadStatus } from '../model/services/useCourse';

export function CourseFeedback ({ status, }: { status: CourseLoadStatus }) {
  const { t, } = useTranslation();
  return (
    <section aria-live='polite'>
      {status === 'loading'
        ? <p role='status'>{t('loading')}</p>
        : <>
            <h1 className='heading'>
              {t(status === 'not-found' ? 'course-not-found' : 'course-load-error')}
            </h1>
            <Link href='/courses' className='inline-btn'>{t('back-to-courses')}</Link>
          </>}
    </section>
  );
}
