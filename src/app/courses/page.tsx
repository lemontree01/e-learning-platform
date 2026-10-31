import CoursesPage from '~/screens/CoursesPage/ui/CoursesPage';
import { loadCourses, requestLanguage } from '~/entities/Course/api/serverCourses';

export default async function Page ({ searchParams, }: {
  searchParams: Promise<{ search?: string | string[] }>;
}) {
  // Search results still load in the browser; the full catalog arrives with the HTML.
  if ((await searchParams).search) return <CoursesPage />;
  const language = await requestLanguage();
  const courses = await loadCourses(language);
  return <CoursesPage seed={courses && { language, courses, }} />;
}
