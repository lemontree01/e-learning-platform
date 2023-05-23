import React from 'react'
import "./teacherInfo.scss"

const TeacherInfo = () => {
  return (
    <section className="teacher-profile">
    <h1 className="heading">profile details</h1>
    <div className="details">
      <div className="tutor">
        <img src="images/pic-2.jpg" alt="" />
        <h3>john deo</h3>
        <span>developer</span>
      </div>
      <div className="flex">
        <p>
          total playlists : <span>4</span>
        </p>
        <p>
          total videos : <span>18</span>
        </p>
        <p>
          total likes : <span>1208</span>
        </p>
        <p>
          total comments : <span>52</span>
        </p>
      </div>
    </div>
  </section>
  )
}

export default TeacherInfo