import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import HomePage from "../pages/HomePage";
import Header from "../components/Header/Header";
import Sidebar from "../components/Sidebar/Sidebar";
import Footer from "../components/Footer/Footer";
import AboutPage from "../pages/AboutPage";
import CoursesPage from "../pages/CoursesPage";
import TeachersPage from "../pages/TeachersPage";
import ContactsPage from "../pages/ContactsPage";
import { useAppSelector } from "../state";
import ProfilePage from "../pages/ProfilePage";
import CoursePage from "../pages/CoursePage";
import LessonPage from "../pages/LessonPage";
import TeacherPage from "../pages/TeacherPage";

const AuthorizedRoutes: { path: string; element: () => React.JSX.Element }[] = [
  {
    path: "home",
    element: HomePage,
  },
  {
    path: "about",
    element: AboutPage,
  },
  { path: "courses", element: CoursesPage },
  { path: "teachers", element: TeachersPage },
  { path: "contacts", element: ContactsPage },
  { path: "profile", element: ProfilePage },
];

const AppRoutes = () => {
  const color = useAppSelector((state) => state.theme.color);
  if (color === "dark") {
    document.body.classList.add("dark");
  } else {
    document.body.classList.remove("dark");
  }

  return (
    <>
      <Header />
      <Sidebar />
      <Routes>
        {AuthorizedRoutes.map(({ path, element }) => (
          <Route key={path} path={path} element={<>{element()}</>}></Route>
        ))}
        <Route path={"/course/:id"} element={<CoursePage/>}/>
        <Route path={"/course/:id/:lessonId"} element={<LessonPage/>}/>
        <Route path={"/teachers/:id"} element={<TeacherPage/>}/>
        <Route path={"*"} element={<Navigate to={"/home"} />} />
      </Routes>
      <Footer />
    </>
  );
};

export default AppRoutes;
