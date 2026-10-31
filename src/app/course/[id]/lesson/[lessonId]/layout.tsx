import { type ReactNode } from 'react';
import { loadCourse, requestLanguage } from '~/entities/Course/api/serverCourses';
import { lessonTitle } from '~/entities/Course/model/presentation';
import { routeMetadata } from '~/shared/lib/metadata/routeMetadata';

export async function generateMetadata ({ params, }: {
  params: Promise<{ id: string; lessonId: string }>;
}) {
  const { id, lessonId, } = await params;
  // Rejects only with notFound(); the page throws it too and renders the 404.
  const course = await loadCourse(await requestLanguage(), id).catch(() => null);
  const index = Number(lessonId);
  if (course === null || (course && !(/^\d+$/.test(lessonId) && index < course.numberOfLessons))) {
    return await routeMetadata('/_not-found', { missing: true, });
  }
  return await routeMetadata(
    `/course/${encodeURIComponent(id)}/lesson/${encodeURIComponent(lessonId)}`,
    { title: course && `${lessonTitle(course, index, course.name)} — ${course.name}`, }
  );
}

export default function Layout ({ children, }: { children: ReactNode }) {
  return <>{children}</>;
}
