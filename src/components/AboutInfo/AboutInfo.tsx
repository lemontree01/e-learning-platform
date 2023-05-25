import React from "react";
import "./aboutInfo.scss"
import Background from "../../assets/images/about.png"
import { Link } from "react-router-dom";

const AboutInfo = () => {
  return (
    <section className="about">
      <div className="row">
        <div className="image">
          <img src={Background} alt="" />
        </div>

        <div className="content">
          <h3>why choose us?</h3>
          <p>
          Discover the power of E-learning platform, your ultimate destination for programming and web development education. Unleash your coding potential with expert instructors, interactive lessons, and a supportive community. Start your journey today!
          </p>
          <Link to="../courses" className="inline-btn">
            our courses
          </Link>
        </div>
      </div>

      <div className="box-container">
        <div className="box">
          <i className="fas fa-graduation-cap"></i>
          <div>
            <h3>20+</h3>
            <p>online courses</p>
          </div>
        </div>

        <div className="box">
          <i className="fas fa-user-graduate"></i>
          <div>
            <h3>200+</h3>
            <p>users</p>
          </div>
        </div>

        <div className="box">
          <i className="fas fa-chalkboard-user"></i>
          <div>
            <h3>200+</h3>
            <p>lessons</p>
          </div>
        </div>

        <div className="box">
          <i className="fas fa-briefcase"></i>
          <div>
            <h3>100% free</h3>
            <p>lessons</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutInfo;
