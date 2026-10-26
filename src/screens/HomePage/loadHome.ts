import { getApiLanguage, type ApiLanguage } from '~/entities/Course/api/getApiLanguage';
import { type Course } from '~/entities/Course/model/types/course';
import { type AppLanguage } from '~/shared/config/language';

export interface HomeSeed {
  language: ApiLanguage;
  courses: Course[] | null;
  course: Course | null;
}

function isCourse (value: unknown): value is Course {
  if (!value || typeof value !== 'object') return false;
  const course = value as Partial<Course>;
  return typeof course.id === 'number' && Number.isSafeInteger(course.id) &&
    typeof course.name === 'string' && typeof course.author === 'string' &&
    typeof course.date === 'string' && typeof course.numberOfLessons === 'number';
}

async function readJson (url: string): Promise<unknown> {
  const controller = new AbortController();
  const timer = setTimeout(() => { controller.abort(); }, 4000);
  try {
    const response = await fetch(url, { signal: controller.signal, });
    return response.ok ? await response.json() : null;
  } finally {
    clearTimeout(timer);
  }
}

export async function loadHome (language: AppLanguage): Promise<HomeSeed> {
  const apiLanguage = getApiLanguage(language);
  const origin = process.env.SERVER_URL || 'http://127.0.0.1:3001';
  const missed: HomeSeed = { language: apiLanguage, courses: null, course: null, };
  try {
    const [list, featured] = await Promise.all([
      readJson(`${origin}/api/courses?lang=${apiLanguage}`),
      readJson(`${origin}/api/courses/0?lang=${apiLanguage}`)
    ]);
    return {
      language: apiLanguage,
      courses: Array.isArray(list) ? list.filter(isCourse) : null,
      course: isCourse(featured) ? featured : null,
    };
  } catch {
    return missed;
  }
}
