import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../state";
import {
  Course,
  getCourses,
  getShortCourses,
} from "../../state/features/coursesSlice";
import "./coursesPreview.scss";
import CourseLoading from "../ui/CourseLoading/CourseLoading";


const CoursesPreview = () => {
  const dispatch = useAppDispatch();
  const { courses, status } = useAppSelector((state) => state.courses);

  useEffect(() => {
    dispatch(getShortCourses());
    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
 
  const handleScroll = () => {
    const bottom =
      Math.ceil(window.innerHeight + window.scrollY + 100) >=
      document.documentElement.scrollHeight;
    if (bottom) {
      window.removeEventListener("scroll", handleScroll);
      dispatch(getCourses())
    }
  };
  

  return (
    <section className="courses courses-preview">
      <h1 className="heading">our courses</h1>
      <div className="box-container">
        {status === "loading" && (
          <>
            <CourseLoading />
            <CourseLoading />
            <CourseLoading />
            <CourseLoading />
            <CourseLoading />
            <CourseLoading />
          </>
        )}
        {status === "error" && <>error</>}
        {status === "ok" && (
          <>
            {courses.map((course: Course) => (
              <div className="box course" key={course.id}>
                <div className="tutor">
                  <img src={process.env.SERVER_URL + "/course-1.png"} alt="" />
                  <div className="info">
                    <h3>{course.author}</h3>
                    <span>{course.date}</span>
                  </div>
                </div>
                <div className="thumb">
                  <img src={process.env.SERVER_URL + "/course-1.png"} alt="" />
                  <span>{course.numberOfLessons} videos</span>
                </div>
                <h3 className="title">{course.name}</h3>
                <Link to="../course/1" className="inline-btn">
                  view playlist
                </Link>
              </div>
            ))}
           {courses.length < 7 && <> <CourseLoading />
            <CourseLoading />
            <CourseLoading /></>}
          </>
        )}
      </div>

      {/* <div className="more-btn">
        <a href="courses.html" className="inline-option-btn">
          view all courses
        </a>
      </div> */}
    </section>
  );
};

export default CoursesPreview;
