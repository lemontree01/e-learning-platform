import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../state";
import {
  Course,
  getCourses,
  getShortCourses,
  setCurrentCourse,
} from "../../state/features/coursesSlice";
import "./coursesPreview.scss";
import CourseLoading from "../ui/CourseLoading/CourseLoading";
import Avatar1 from "../../assets/images/pic-1.jpg";
import Avatar2 from "../../assets/images/pic-2.jpg";
import Avatar3 from "../../assets/images/pic-3.jpg";
import Avatar4 from "../../assets/images/pic-4.jpg";
import Avatar5 from "../../assets/images/pic-5.jpg";
import Avatar6 from "../../assets/images/pic-6.jpg";
import Avatar7 from "../../assets/images/pic-7.jpg";
import Avatar8 from "../../assets/images/pic-8.jpg";

const CoursesPreview = () => {
  const dispatch = useAppDispatch();
  const { courses, status, searchedCourses, isSearched } = useAppSelector(
    (state) => state.courses
  );
  console.log(searchedCourses);
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
      dispatch(getCourses());
    }
  };

  return (
    <section className="courses courses-preview">
      <h1 className="heading">our courses</h1>
      <div className="box-container">
        {status === "loading" && (
          <>
            {[...Array(6)].map((_, index) => (
              <CourseLoading key={index} />
            ))}
          </>
        )}
        {status === "error" && <>error</>}
        {status === "ok" && !isSearched && (
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
                  <img src={process.env.SERVER_URL + "/course-" + course.id + ".jpg"} alt="" />
                  <span>{course.numberOfLessons} videos</span>
                </div>
                <h3 className="title">{course.name}</h3>
                <Link
                  to={"../course/" + course.id}
                  onClick={() => dispatch(setCurrentCourse(course.id))}
                  className="inline-btn"
                >
                  view playlist
                </Link>
              </div>
            ))}
            {courses.length < 7 && (
              <>
                {" "}
                <CourseLoading />
                <CourseLoading />
                <CourseLoading />
              </>
            )}
          </>
        )}
        {status === "ok" && isSearched && (searchedCourses.map((course: Course) => (
              <div className="box course" key={course.id}>
                <div className="tutor">
                  <img src={process.env.SERVER_URL + "/course-1.png"} alt="" />
                  <div className="info">
                    <h3>{course.author}</h3>
                    <span>{course.date}</span>
                  </div>
                </div>
                <div className="thumb">
                  <img src={process.env.SERVER_URL + "/course-" + course.id +".jpg"} alt="" />
                  <span>{course.numberOfLessons} videos</span>
                </div>
                <h3 className="title">{course.name}</h3>
                <Link
                  to={"../course/" + course.id}
                  onClick={() => dispatch(setCurrentCourse(course.id))}
                  className="inline-btn"
                >
                  view playlist
                </Link>
              </div>
            )))}
      </div>
    </section>
  );
};

export default CoursesPreview;
