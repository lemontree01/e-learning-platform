export const getRouteCourse = (courseId: string) => `/course/${courseId}`;
export const getRouteLesson = (courseId: string, lessonId: string) =>
  `/course/${courseId}/lesson/${lessonId}`;
