import React, { useState } from "react";
import "./header.scss";
import Img from "../../assets/images/pic-1.jpg";
import { useAppDispatch, useAppSelector } from "../../state";
import { toggleColor, toggleSidebar } from "../../state/features/themeSlice";
import { Link } from "react-router-dom";

const Header = () => {
  const dispatch = useAppDispatch();
  const color = useAppSelector((state) => state.theme.color);
  const [isUserShown, setIsUserShown] = useState(false);
  const {username, role} = useAppSelector(state => state.user)

  const toggleIsUserShown = () => {
    setIsUserShown((prev) => !prev);
  };

  return (
    <header className="header">
      <section className="flex">
        <a href="home.html" className="logo">
          E-learning platform
        </a>
        <form action="search.html" method="post" className="search-form">
          <input
            type="text"
            name="search_box"
            required
            placeholder="search courses..."
            maxLength={100}
          />
          <button type="submit" className="fas fa-search"></button>
        </form>

        <div className="icons">
          <div onClick={() => dispatch(toggleSidebar())} id="menu-btn" className="fas fa-bars"></div>
          <div id="search-btn" className="fas fa-search"></div>
          <div
            onClick={toggleIsUserShown}
            id="user-btn"
            className="fas fa-user"
          ></div>
          <div
            onClick={() => dispatch(toggleColor())}
            id="toggle-btn"
            className={`fas ${color === "dark" ? "fa-sun" : "fa-moon"}`}
          ></div>
        </div>

        <div className={`profile ${isUserShown && "active"}`}>
          <img src={Img} className="image" alt="" />
          <h3 className="name">{username}</h3>
          <p className="role">{role}</p>
          <Link onClick={()=>setIsUserShown(false)} to="profile" className="btn">
            view profile
          </Link>
          <div className="flex-btn">
            <a href="login.html" className="option-btn">
              login
            </a>
            <a href="register.html" className="option-btn">
              register
            </a>
          </div>
        </div>
      </section>
    </header>
  );
};

export default Header;
