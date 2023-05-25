import React, { useState, useRef } from "react";
import "./header.scss";
import Img from "../../assets/images/pic-1.jpg";
import { useAppDispatch, useAppSelector } from "../../state";
import { toggleColor, toggleSidebar } from "../../state/features/themeSlice";
import { Link, useNavigate } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import MenuIcon from "@mui/icons-material/Menu";
import PersonIcon from "@mui/icons-material/Person";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import {
  searchCourses,
  setIsSearched,
} from "../../state/features/coursesSlice";

const Header = () => {
  const dispatch = useAppDispatch();
  const color = useAppSelector((state) => state.theme.color);

  const [isUserShown, setIsUserShown] = useState(false);
  const [query, setQuery] = useState("");
  const debounceTimerRef = useRef<string | number | NodeJS.Timeout | undefined>(
    undefined
  );

  const navigate = useNavigate();

  const { username, role } = useAppSelector((state) => state.user);

  const toggleIsUserShown = () => {
    setIsUserShown((prev) => !prev);
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    if (e.target.value) {
      dispatch(setIsSearched(true));
    } else {
      dispatch(setIsSearched(false));
    }
    clearTimeout(debounceTimerRef.current);

    debounceTimerRef.current = setTimeout(() => {
      console.log("Dassad");
      dispatch(searchCourses({ query: e.target.value }));
    }, 500);
  };

  return (
    <header className="header">
      <section>
        <Link to="/home" className="logo">
          E-learning platform
        </Link>
        <div className="search-form">
          <input
            type="text"
            name="search_box"
            required
            placeholder="search courses..."
            maxLength={25}
            value={query}
            onChange={onInputChange}
          />
          <button onClick={() => navigate("/home")}>
            <SearchIcon className={"icon-mui"} />
          </button>
        </div>

        <div className="icons">
          <div onClick={() => dispatch(toggleSidebar())} id="menu-btn">
            <MenuIcon className={"icon-mui"} />
          </div>
          <div onClick={toggleIsUserShown} id="user-btn">
            <PersonIcon className={"icon-mui"} />
          </div>
          <div onClick={() => dispatch(toggleColor())} id="toggle-btn">
            {color === "dark" ? (
              <LightModeIcon className={"icon-mui"} />
            ) : (
              <DarkModeIcon className={"icon-mui"} />
            )}
          </div>
        </div>

        <div className={`profile ${isUserShown && "active"}`}>
          <img src={Img} className="image" alt="" />
          <h3 className="name">{username}</h3>
          <p className="role">{role}</p>
          <Link
            onClick={() => setIsUserShown(false)}
            to="profile"
            className="btn"
          >
            view profile
          </Link>
          <div className="flex-btn">
            <Link to="login" className="option-btn">
              login
            </Link>
            <Link to="register" className="option-btn">
              register
            </Link>
          </div>
        </div>
      </section>
    </header>
  );
};

export default Header;
