import React from "react";
import "./header.scss";
import Img from "../../assets/images/pic-1.jpg";
import { useAppDispatch } from "../../state";
import { changeColor, toggleColor } from "../../state/features/themeSlice";

const Header = () => {
  const dispatch = useAppDispatch();
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
          <div id="menu-btn" className="fas fa-bars"></div>
          <div id="search-btn" className="fas fa-search"></div>
          <div id="user-btn" className="fas fa-user"></div>
          <div
            onClick={() => dispatch(toggleColor())}
            id="toggle-btn"
            className="fas fa-sun"
          ></div>
        </div>

        <div className="profile">
          <img src={Img} className="image" alt="" />
          <h3 className="name">shaikh anas</h3>
          <p className="role">studen</p>
          <a href="profile.html" className="btn">
            view profile
          </a>
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
