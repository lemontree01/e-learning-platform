import { type ReactNode } from 'react';
import { loadCourse, requestLanguage } from '~/entities/Course/api/serverCourses';
import { routeMetadata } from '~/shared/lib/metadata/routeMetadata';

export async function generateMetadata ({ params, }: { params: Promise<{ id: string }> }) {
  const { id, } = await params;
  // Rejects only with notFound(); the page throws it too and renders the course 404.
  const course = await loadCourse(await requestLanguage(), id).catch(() => null);
  if (course === null) return await routeMetadata('/_not-found', { missing: true, });
  return await routeMetadata(`/course/${encodeURIComponent(id)}`, { title: course?.name, });
}

export default function Layout ({ children, }: { children: ReactNode }) {
  return <>{children}</>;
}
