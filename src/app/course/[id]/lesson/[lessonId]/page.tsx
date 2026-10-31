import LessonPage from '~/screens/LessonPage/ui/LessonPage';
import { loadCourse, loadLesson, requestLanguage } from '~/entities/Course/api/serverCourses';

export default async function Page ({ params, }: {
  params: Promise<{ id: string; lessonId: string }>;
}) {
  const { id, lessonId, } = await params;
  const language = await requestLanguage();
  const [course, lesson] = await Promise.all([
    loadCourse(language, id), loadLesson(language, id, lessonId)
  ]);
  return <LessonPage seed={course && { language, course, lessonId, lesson, }} />;
}
