import { cache } from 'react';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import { LANGUAGE_COOKIE, normalizeLanguage } from '~/shared/config/language';
import { type Course, type CourseLesson } from '../model/types/course';
import { getApiLanguage, type ApiLanguage } from './getApiLanguage';

// Server only: pages read the API directly, so their HTML already holds the data.

export function isCourse (value: unknown): value is Course {
  if (!value || typeof value !== 'object') return false;
  const course = value as Partial<Course>;
  return typeof course.id === 'number' && Number.isSafeInteger(course.id) &&
    typeof course.name === 'string' && typeof course.author === 'string' &&
    typeof course.date === 'string' && typeof course.numberOfLessons === 'number';
}

function isLesson (value: unknown): value is CourseLesson {
  if (!value || typeof value !== 'object') return false;
  const lesson = value as Partial<CourseLesson>;
  return typeof lesson.title === 'string' && Array.isArray(lesson.blocks);
}

// status 0 means the API was unreachable or slower than 4 s.
export async function readApi (path: string): Promise<{ status: number; data: unknown }> {
  const origin = process.env.SERVER_URL || 'http://127.0.0.1:3001';
  const controller = new AbortController();
  const timer = setTimeout(() => { controller.abort(); }, 4000);
  try {
    const response = await fetch(`${origin}/api${path}`, { signal: controller.signal, });
    return { status: response.status, data: response.ok ? await response.json() : null, };
  } catch {
    return { status: 0, data: null, };
  } finally {
    clearTimeout(timer);
  }
}

export async function requestLanguage (): Promise<ApiLanguage> {
  return getApiLanguage(normalizeLanguage((await cookies()).get(LANGUAGE_COOKIE)?.value));
}

// The loaders below throw notFound() only when the API answers that the item does not exist
// (404, or 400 for a malformed id). Any other failure returns undefined: the page then
// renders without data and loads it in the browser, with its usual error and retry states.

export const loadCourses = cache(async (language: ApiLanguage) => {
  const { data, } = await readApi(`/courses?lang=${language}`);
  return Array.isArray(data) ? data.filter(isCourse) : undefined;
});

export const loadCourse = cache(async (language: ApiLanguage, id: string) => {
  const { status, data, } = await readApi(`/courses/${encodeURIComponent(id)}?lang=${language}`);
  if (status === 404 || status === 400) notFound();
  return isCourse(data) ? data : undefined;
});

export const loadLesson = cache(async (language: ApiLanguage, id: string, lessonId: string) => {
  const { status, data, } = await readApi(
    `/courses/${encodeURIComponent(id)}/lessons/${encodeURIComponent(lessonId)}?lang=${language}`
  );
  if (status === 404 || status === 400) notFound();
  return isLesson(data) ? data : undefined;
});
