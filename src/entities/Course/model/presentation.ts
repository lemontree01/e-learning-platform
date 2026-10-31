import { type Course } from './types/course';

export function lessonTitle (course: Course, index: number, fallback: string) {
  return course.lessons?.[index]?.title.replace(/^\d+[.)]\s*/, '').trim() || fallback;
}

// A course without lessons yet is announced in the catalog as coming soon.
export function isComingSoon (course: Course) {
  return course.numberOfLessons === 0;
}
