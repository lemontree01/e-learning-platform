'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useTranslation } from 'react-i18next';

// Rendered with a 404 status for a lesson index the course does not have, including every
// lesson of a coming-soon course.
export default function LessonNotFound () {
  const { t, } = useTranslation();
  const { id, } = useParams<{ id: string }>();
  return (
    <section>
      <div className="state-panel">
        <h1 className="heading">{t('lesson-not-found')}</h1>
        <Link href={`/course/${id}`} className="action">{t('view-course')}</Link>
      </div>
    </section>
  );
}
