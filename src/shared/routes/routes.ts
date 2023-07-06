export enum AppRoutes {
  HOME = 'HOME',
  PROFILE = 'PROFILE',
  LOGIN = 'LOGIN',
  REGISTER = 'REGISTER',
  ABOUT = 'ABOUT',
  COURSES = 'COURSES',
  COURSE = 'COURSE',
  LESSON = 'LESSON',
  TEACHERS = 'TEACHERS',
  TEACHER = 'TEACHER',
  CONTACTS = 'CONTACTS',
  ANY = 'ANY'
}

export const getRouteHome = () => '/home';
export const getRouteProfile = () => '/profile';
export const getRouteLogin = () => '/login';
export const getRouteAbout = () => '/about';
export const getRouteRegister = () => '/register';
export const getRouteAllCourses = () => '/courses';
export const getRouteCourse = (courseId: string) => `/course/${courseId}`;
export const getRouteLesson = (lessonId: string) => `/lesson/${lessonId}`;
export const getRouteAllTeachers = () => '/teachers';
export const getRouteTeacher = (teacherId: string) => `/teachers/${teacherId}`;
export const getContacts = () => '/contacts';
export const getAny = () => '*'

export const AppRouteByPathPattern: Record<string, AppRoutes> = {
  [getRouteHome()]: AppRoutes.HOME,
  [getRouteProfile()]: AppRoutes.PROFILE,
  [getRouteLogin()]: AppRoutes.LOGIN,
  [getRouteRegister()]: AppRoutes.REGISTER,
  [getRouteAbout()]: AppRoutes.ABOUT,
  [getRouteAllCourses()]: AppRoutes.COURSES,
  [getRouteCourse(':id')]: AppRoutes.COURSE,
  [getRouteLesson(':id')]: AppRoutes.LESSON,
  [getRouteAllTeachers()]: AppRoutes.TEACHERS,
  [getRouteTeacher(':id')]: AppRoutes.TEACHER,
  [getContacts()]: AppRoutes.CONTACTS,
  [getAny()]: AppRoutes.ANY,
};
