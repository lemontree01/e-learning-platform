import { type Response } from '~/shared/types/Response';

export interface Course {
  author: string;
  date: string;
  numberOfLessons: number;
  name: string;
  id: number;
}

export interface CourseSchema {
  courses: Course[];
  searchedCourses: Course[];
  status: Response;
  isSearched: boolean;
  currentCourse?: Course;
}
