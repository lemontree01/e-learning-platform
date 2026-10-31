import { getApiLanguage, type ApiLanguage } from '~/entities/Course/api/getApiLanguage';
import { isCourse, readApi } from '~/entities/Course/api/serverCourses';
import { type Course } from '~/entities/Course/model/types/course';
import { type AppLanguage } from '~/shared/config/language';

export interface HomeSeed {
  language: ApiLanguage;
  courses: Course[] | null;
  course: Course | null;
}

export async function loadHome (language: AppLanguage): Promise<HomeSeed> {
  const apiLanguage = getApiLanguage(language);
  const [list, featured] = await Promise.all([
    readApi(`/courses?lang=${apiLanguage}`),
    readApi(`/courses/0?lang=${apiLanguage}`)
  ]);
  return {
    language: apiLanguage,
    courses: Array.isArray(list.data) ? list.data.filter(isCourse) : null,
    course: isCourse(featured.data) ? featured.data : null,
  };
}
