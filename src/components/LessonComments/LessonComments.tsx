import React from "react";
import "./lessonComments.scss"
import avatars from "../../utils/avatars";

const LessonComments = () => {
  return (
    <section className="comments">
      <h1 className="heading">2 comments</h1>

      <form action="" className="add-comment">
        <h3>add comments</h3>
        <textarea
          name="comment_box"
          placeholder="enter your comment"
          required
          maxLength={1000}
          cols={30}
          rows={10}
        ></textarea>
        <input
          value="add comment"
          className="inline-btn"
          name="add_comment"
        />
      </form>

      <h1 className="heading">user comments</h1>

      <div className="box-container">
        <div className="box">
          <div className="user">
          <img src={avatars[Math.random() * 9 | 0]} alt="" />
            <div>
              <h3>Guest</h3>
              <span>22-10-2022</span>
            </div>
          </div>
          <div className="comment-box">this is a comment form shaikh anas</div>
          <form action="" className="flex-btn">
            <input
              type="submit"
              value="edit comment"
              name="edit_comment"
              className="inline-option-btn"
              disabled
            />
            <input
              type="submit"
              value="delete comment"
              name="delete_comment"
              className="inline-delete-btn"
              disabled
            />
          </form>
        </div>

        <div className="box">
          <div className="user">
            <img src={avatars[Math.random() * 9 | 0]} alt="" />
            <div>
              <h3>Alan Brown</h3>
              <span>22-10-2022</span>
            </div>
          </div>
          <div className="comment-box">awesome tutorial! keep going!</div>
        </div>

      </div>
    </section>
  );
};

export default LessonComments;
