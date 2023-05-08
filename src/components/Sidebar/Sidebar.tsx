import React from "react";
import Avatar from "../../assets/images/pic-1.jpg";
import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="side-bar">
      <div id="close-btn">
        <i className="fas fa-times"></i>
      </div>

      <div className="profile">
        <img src={Avatar} className="image" alt="" />
        <h3 className="name">shaikh anas</h3>
        <p className="role">studen</p>
        <a href="profile.html" className="btn">
          view profile
        </a>
      </div>

      <nav className="navbar">
        <Link to={"/home"}>
          <i className="fas fa-home"></i>
          <span>home</span>
        </Link>
        <Link to={"/about"}>
          <i className="fas fa-question"></i>
          <span>about</span>
        </Link>
        <Link to={"/courses"}>
          <i className="fas fa-graduation-cap"></i>
          <span>courses</span>
        </Link>
        <Link to={"/teachers"}>
          <i className="fas fa-chalkboard-user"></i>
          <span>teachers</span>
        </Link>
        <Link to={"/contacts"}>
          <i className="fas fa-headset"></i>
          <span>contact us</span>
        </Link>
      </nav>
    </div>
  );
};

export default Sidebar;
