import React, { useEffect } from "react";
import CourseInfo from "../components/CourseInfo/CourseInfo";
import { useLocation, useParams } from "react-router";

const CoursePage = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, []);
  return (
    <>
      <CourseInfo />
    </>
  );
};

export default CoursePage;
