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
        <Route path={"home"} element={<HomePage />} />
        <Route path={"about"} element={<AboutPage />} />
        <Route path={"courses"} element={<CoursesPage />} />
        <Route path={"teachers"} element={<TeachersPage />} />
        <Route path={"contacts"} element={<ContactsPage />} />
        <Route path={"*"} element={<Navigate to={"/home"} />} />
      </Routes>
      <Footer />
    </>
  );
};

export default AppRoutes;
