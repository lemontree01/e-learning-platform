import React from "react";
import Avatar from "../../assets/images/pic-1.jpg";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../state";
import { toggleSidebar } from "../../state/features/themeSlice";
import "./sidebar.scss"

const Sidebar = () => {
  const isSideBarShown = useAppSelector((state) => state.theme.isSideBarShown);
  const { username, role } = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  const body = document.body;
  if (isSideBarShown) {
    body.classList.add("active");
  } else {
    body.classList.remove("active");
  }

  return (
    <div className={`side-bar ${isSideBarShown && "active"}`}>
      <div
        id="close-btn"
        onClick={() => {
          if (isSideBarShown) {
            dispatch(toggleSidebar());
          }
        }}
      >
        <i className="fas fa-times"></i>
      </div>

      <div className="profile">
        <img src={Avatar} className="image" alt="" />
        <h3 className="name">{username}</h3>
        <p className="role">{role}</p>
        <Link to="profile" className="btn">
          view profile
        </Link>
      </div>

      <nav className="navbar">
        <Link to={"/home"}>
          <i className="fas fa-home"></i>
          <span>Home</span>
        </Link>
        <Link to={"/about"}>
          <i className="fas fa-question"></i>
          <span>About</span>
        </Link>
        <Link to={"/courses"}>
          <i className="fas fa-graduation-cap"></i>
          <span>Courses</span>
        </Link>
        <Link to={"/teachers"}>
          <i className="fas fa-chalkboard-user"></i>
          <span>Teachers</span>
        </Link>
        <Link to={"/contacts"}>
          <i className="fas fa-headset"></i>
          <span>Contact us</span>
        </Link>
      </nav>
    </div>
  );
};

export default Sidebar;
