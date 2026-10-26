import { type Response } from '~/shared/types/Response';

export type LessonBlock =
  | { type: 'text'; heading: string; body: string }
  | { type: 'picture'; src: string; alt: string }
  | { type: 'video'; poster: string; title: string; caption: string }
  | { type: 'code'; language: string; code: string; starters?: Partial<Record<'javascript' | 'python', string>> }
  | { type: 'console'; command: string; output: string };

export interface CourseLesson {
  title: string;
  blocks: LessonBlock[];
}

export interface Course {
  author: string;
  date: string;
  numberOfLessons: number;
  name: string;
  id: number;
  lessons?: Array<Pick<CourseLesson, 'title'>>;
}

export interface CourseSchema {
  courses: Course[];
  searchedCourses: Course[];
  status: Response;
  isSearched: boolean;
  currentCourse?: Course;
  details?: Record<string, Course>;
  lessonDetails?: Record<string, CourseLesson>;
}
