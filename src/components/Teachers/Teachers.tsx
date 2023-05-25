import React from "react";
import "./teachers.scss"
import { Link } from "react-router-dom";
import avatars from "../../utils/avatars";

const Teachers = () => {
  return (
    <section className="teachers">
      <h1 className="heading">expert teachers</h1>
      <form action="" method="post" className="search-tutor">
        <input
          type="text"
          name="search_box"
          placeholder="search tutors..."
          required
        />
        <button
          type="submit"
          className="fas fa-search"
          name="search_tutor"
        ></button>
      </form>

      <div className="box-container">
        <div className="box offer">
          <h3>become a tutor</h3>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Eveniet,
            itaque ipsam fuga ex et aliquam.
          </p>
          <Link to="/1" className="inline-btn">
            get started
          </Link>
        </div>

        <div className="box">
          <div className="tutor">
            <img src={avatars[Math.random() * 9 | 0]} alt="" />
            <div>
              <h3>john deo</h3>
              <span>developer</span>
            </div>
          </div>
          <p>
            total playlists : <span>4</span>
          </p>
          <p>
            total videos : <span>18</span>
          </p>
          <p>
            total likes : <span>1208</span>
          </p>
          <Link to="1" className="inline-btn">
            View profile
          </Link>
        </div>

        <div className="box">
          <div className="tutor">
            <img src={avatars[Math.random() * 9 | 0]} alt="" />
            <div>
              <h3>john deo</h3>
              <span>developer</span>
            </div>
          </div>
          <p>
            total playlists : <span>4</span>
          </p>
          <p>
            total videos : <span>18</span>
          </p>
          <p>
            total likes : <span>1208</span>
          </p>
          <a href="teacher_profile.html" className="inline-btn">
            view profile
          </a>
        </div>

        <div className="box">
          <div className="tutor">
            <img src={avatars[Math.random() * 9 | 0]} alt="" />
            <div>
              <h3>john deo</h3>
              <span>developer</span>
            </div>
          </div>
          <p>
            total playlists : <span>4</span>
          </p>
          <p>
            total videos : <span>18</span>
          </p>
          <p>
            total likes : <span>1208</span>
          </p>
          <a href="teacher_profile.html" className="inline-btn">
            view profile
          </a>
        </div>

        <div className="box">
          <div className="tutor">
            <img src={avatars[Math.random() * 9 | 0]} alt="" />
            <div>
              <h3>john deo</h3>
              <span>developer</span>
            </div>
          </div>
          <p>
            total playlists : <span>4</span>
          </p>
          <p>
            total videos : <span>18</span>
          </p>
          <p>
            total likes : <span>1208</span>
          </p>
          <a href="teacher_profile.html" className="inline-btn">
            view profile
          </a>
        </div>

        <div className="box">
          <div className="tutor">
            <img src={avatars[Math.random() * 9 | 0]} alt="" />
            <div>
              <h3>john deo</h3>
              <span>developer</span>
            </div>
          </div>
          <p>
            total playlists : <span>4</span>
          </p>
          <p>
            total videos : <span>18</span>
          </p>
          <p>
            total likes : <span>1208</span>
          </p>
          <a href="teacher_profile.html" className="inline-btn">
            view profile
          </a>
        </div>

        <div className="box">
          <div className="tutor">
            <img src={avatars[Math.random() * 9 | 0]} alt="" />
            <div>
              <h3>john deo</h3>
              <span>developer</span>
            </div>
          </div>
          <p>
            total playlists : <span>4</span>
          </p>
          <p>
            total videos : <span>18</span>
          </p>
          <p>
            total likes : <span>1208</span>
          </p>
          <a href="teacher_profile.html" className="inline-btn">
            view profile
          </a>
        </div>

        <div className="box">
          <div className="tutor">
            <img src={avatars[Math.random() * 9 | 0]} alt="" />
            <div>
              <h3>john deo</h3>
              <span>developer</span>
            </div>
          </div>
          <p>
            total playlists : <span>4</span>
          </p>
          <p>
            total videos : <span>18</span>
          </p>
          <p>
            total likes : <span>1208</span>
          </p>
          <a href="teacher_profile.html" className="inline-btn">
            view profile
          </a>
        </div>
      </div>
    </section>
  );
};

export default Teachers;
