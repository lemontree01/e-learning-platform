import React from 'react'
import "./lesson.scss"

const Lesson = () => {
  return (
    <section className="watch-video">
        <div className="video-container">
          <div className="video">
            <video
              src="images/vid-1.mp4"
              controls
              poster="images/post-1-1.png"
              id="video"
            ></video>
          </div>
          <h3 className="title">complete HTML tutorial (part 01)</h3>
          <div className="info">
            <p className="date">
              <i className="fas fa-calendar"></i>
              <span>22-10-2022</span>
            </p>
            <p className="date">
              <i className="fas fa-heart"></i>
              <span>44 likes</span>
            </p>
          </div>
          <div className="tutor">
            <img src="images/pic-2.jpg" alt="" />
            <div>
              <h3>john deo</h3>
              <span>developer</span>
            </div>
          </div>
          <form action="" method="post" className="flex">
            <a href="playlist.html" className="inline-btn">
              view playlist
            </a>
            <button>
              <i className="far fa-heart"></i>
              <span>like</span>
            </button>
          </form>
          <p className="description">
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Itaque
            labore ratione, hic exercitationem mollitia obcaecati culpa dolor
            placeat provident porro. Lorem, ipsum dolor sit amet consectetur
            adipisicing elit. Aliquid iure autem non fugit sint. A, sequi rerum
            architecto dolor fugiat illo, iure velit nihil laboriosam cupiditate
            voluptatum facere cumque nemo!
          </p>
        </div>
      </section>
  )
}

export default Lesson