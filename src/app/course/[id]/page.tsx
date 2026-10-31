import CoursePage from '~/screens/CoursePage/ui/CoursePage';
import { loadCourse, requestLanguage } from '~/entities/Course/api/serverCourses';

export default async function Page ({ params, }: { params: Promise<{ id: string }> }) {
  const { id, } = await params;
  const language = await requestLanguage();
  const course = await loadCourse(language, id);
  return <CoursePage seed={course && { language, course, }} />;
}
