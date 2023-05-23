import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./courseInfo.scss"

const CourseInfo = () => {
  const location = useLocation()
  const courseId = location.pathname.split("/").at(-1) ?? ""
  return (
    <>
      <section className="playlist-details">
        <h1 className="heading">playlist details</h1>

        <div className="row">
          <div className="column">
            <form action="" method="post" className="save-playlist">
              <button type="submit">
                <i className="far fa-bookmark"></i> <span>save playlist</span>
              </button>
            </form>

            <div className="thumb">
              <img src="images/thumb-1.png" alt="" />
              <span>10 videos</span>
            </div>
          </div>
          <div className="column">
            <div className="tutor">
              <img src="images/pic-2.jpg" alt="" />
              <div>
                <h3>john deo</h3>
                <span>21-10-2022</span>
              </div>
            </div>

            <div className="details">
              <h3>complete HTML tutorial</h3>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Illum
                minus reiciendis, error sunt veritatis exercitationem deserunt
                velit doloribus itaque voluptate.
              </p>
              <a href="teacher_profile.html" className="inline-btn">
                view profile
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="playlist-videos">
        <h1 className="heading">playlist videos</h1>

        <div className="box-container">
          <Link className="box" to={`/course/${courseId}/1`}>
            <i className="fas fa-play"></i>
            <img src="images/post-1-1.png" alt="" />
            <h3>complete HTML tutorial (part 01)</h3>
          </Link>

          <a className="box" href="watch-video.html">
            <i className="fas fa-play"></i>
            <img src="images/post-1-2.png" alt="" />
            <h3>complete HTML tutorial (part 02)</h3>
          </a>

          <a className="box" href="watch-video.html">
            <i className="fas fa-play"></i>
            <img src="images/post-1-3.png" alt="" />
            <h3>complete HTML tutorial (part 03)</h3>
          </a>

          <a className="box" href="watch-video.html">
            <i className="fas fa-play"></i>
            <img src="images/post-1-4.png" alt="" />
            <h3>complete HTML tutorial (part 04)</h3>
          </a>

          <a className="box" href="watch-video.html">
            <i className="fas fa-play"></i>
            <img src="images/post-1-5.png" alt="" />
            <h3>complete HTML tutorial (part 05)</h3>
          </a>

          <a className="box" href="watch-video.html">
            <i className="fas fa-play"></i>
            <img src="images/post-1-6.png" alt="" />
            <h3>complete HTML tutorial (part 06)</h3>
          </a>
        </div>
      </section>
    </>
  );
};

export default CourseInfo;
