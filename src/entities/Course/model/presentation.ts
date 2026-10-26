import { type Course } from './types/course';

// Only this course currently contains a complete, authored curriculum.
export const FEATURED_COURSE_ID = 0;

export function lessonTitle (course: Course, index: number, fallback: string) {
  return course.lessons?.[index]?.title.replace(/^\d+[.)]\s*/, '').trim() || fallback;
}

export function isCompleteCourse (course: Course) {
  return course.id === FEATURED_COURSE_ID;
}
