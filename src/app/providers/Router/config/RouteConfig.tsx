import {
  Navigate,
  type RouteProps
} from 'react-router-dom';
import {
  AppRoutes,
  getAny,
  getContacts,
  getRouteAbout,
  getRouteAllCourses,
  getRouteAllTeachers,
  getRouteCourse,
  getRouteHome,
  getRouteLesson,
  getRouteLogin,
  getRouteProfile,
  getRouteRegister,
  getRouteTeacher
} from '~/shared/routes/routes';
import { AboutPage } from '~/pages/AboutPage';
import { HomePage } from '~/pages/HomePage';
import { ProfilePage } from '~/pages/ProfilePage';
import { LoginPage } from '~/pages/LoginPage';
import { CoursePage } from '~/pages/CoursePage';
import { LessonPage } from '~/pages/LessonPage';
import { TeachersPage } from '~/pages/TeachersPage';
import { RegisterPage } from '~/pages/RegisterPage';
import { CoursesPage } from '~/pages/CoursesPage';
import { TeacherPage } from '~/pages/TeacherPage';
import { ContactsPage } from '~/pages/ContactsPage';

export const RouteConfig: Record<AppRoutes, RouteProps> = {
  [AppRoutes.HOME]: {
    path: getRouteHome(),
    element: <HomePage />,
  },
  [AppRoutes.PROFILE]: {
    path: getRouteProfile(),
    element: <ProfilePage/>,
  },
  [AppRoutes.LOGIN]: {
    path: getRouteLogin(),
    element: <LoginPage/>,
  },
  [AppRoutes.REGISTER]: {
    path: getRouteRegister(),
    element: <RegisterPage/>,
  },
  [AppRoutes.ABOUT]: {
    path: getRouteAbout(),
    element: <AboutPage />,
  },
  [AppRoutes.COURSES]: {
    path: getRouteAllCourses(),
    element: <CoursesPage />,
  },
  [AppRoutes.COURSE]: {
    path: getRouteCourse(':id'),
    element: <CoursePage/>,
  },
  [AppRoutes.LESSON]: {
    path: getRouteLesson(':id'),
    element: <LessonPage/>,
  },
  [AppRoutes.TEACHERS]: {
    path: getRouteAllTeachers(),
    element: <TeachersPage/>,
  },
  [AppRoutes.TEACHER]: {
    path: getRouteTeacher(':id'),
    element: <TeacherPage/>,
  },
  [AppRoutes.CONTACTS]: {
    path: getContacts(),
    element: <ContactsPage/>,
  },
  [AppRoutes.ANY]: {
    path: getAny(),
    element: <Navigate to="/home" replace />,
  },
};
