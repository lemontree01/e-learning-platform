import React from "react";
import "./teacherCourses.scss"

const TeacherCourses = () => {
  return (
    <section className="courses">
      <h1 className="heading">our courses</h1>

      <div className="box-container">
        <div className="box">
          <div className="thumb">
            <img src="images/thumb-1.png" alt="" />
            <span>10 videos</span>
          </div>
          <h3 className="title">complete HTML tutorial</h3>
          <a href="playlist.html" className="inline-btn">
            view playlist
          </a>
        </div>

        <div className="box">
          <div className="thumb">
            <img src="images/thumb-2.png" alt="" />
            <span>10 videos</span>
          </div>
          <h3 className="title">complete CSS tutorial</h3>
          <a href="playlist.html" className="inline-btn">
            view playlist
          </a>
        </div>

        <div className="box">
          <div className="thumb">
            <img src="images/thumb-3.png" alt="" />
            <span>10 videos</span>
          </div>
          <h3 className="title">complete javascript tutorial</h3>
          <a href="playlist.html" className="inline-btn">
            view playlist
          </a>
        </div>

        <div className="box">
          <div className="thumb">
            <img src="images/thumb-4.png" alt="" />
            <span>10 videos</span>
          </div>
          <h3 className="title">complete Boostrap tutorial</h3>
          <a href="playlist.html" className="inline-btn">
            view playlist
          </a>
        </div>
      </div>
    </section>
  );
};

export default TeacherCourses;
