import React from "react";
import "./aboutInfo.scss"

const AboutInfo = () => {
  return (
    <section className="about">
      <div className="row">
        <div className="image">
          <img src="images/about-img.svg" alt="" />
        </div>

        <div className="content">
          <h3>why choose us?</h3>
          <p>
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ut dolorum
            quasi illo? Distinctio expedita commodi, nemo a quam error
            repellendus sint, fugiat quis numquam eum eveniet sequi aspernatur
            quaerat tenetur.
          </p>
          <a href="courses.html" className="inline-btn">
            our courses
          </a>
        </div>
      </div>

      <div className="box-container">
        <div className="box">
          <i className="fas fa-graduation-cap"></i>
          <div>
            <h3>+10k</h3>
            <p>online courses</p>
          </div>
        </div>

        <div className="box">
          <i className="fas fa-user-graduate"></i>
          <div>
            <h3>+40k</h3>
            <p>brilliant students</p>
          </div>
        </div>

        <div className="box">
          <i className="fas fa-chalkboard-user"></i>
          <div>
            <h3>+2k</h3>
            <p>expert tutors</p>
          </div>
        </div>

        <div className="box">
          <i className="fas fa-briefcase"></i>
          <div>
            <h3>100%</h3>
            <p>job placement</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutInfo;
