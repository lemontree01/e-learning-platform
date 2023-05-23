import React from "react";
import "./lessonComments.scss"

const LessonComments = () => {
  return (
    <section className="comments">
      <h1 className="heading">5 comments</h1>

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
          type="submit"
          value="add comment"
          className="inline-btn"
          name="add_comment"
        />
      </form>

      <h1 className="heading">user comments</h1>

      <div className="box-container">
        <div className="box">
          <div className="user">
            <img src="images/pic-1.jpg" alt="" />
            <div>
              <h3>shaikh anas</h3>
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
            />
            <input
              type="submit"
              value="delete comment"
              name="delete_comment"
              className="inline-delete-btn"
            />
          </form>
        </div>

        <div className="box">
          <div className="user">
            <img src="images/pic-2.jpg" alt="" />
            <div>
              <h3>john deo</h3>
              <span>22-10-2022</span>
            </div>
          </div>
          <div className="comment-box">awesome tutorial! keep going!</div>
        </div>

        <div className="box">
          <div className="user">
            <img src="images/pic-3.jpg" alt="" />
            <div>
              <h3>john deo</h3>
              <span>22-10-2022</span>
            </div>
          </div>
          <div className="comment-box">
            amazing way of teaching! thank you so much!
          </div>
        </div>

        <div className="box">
          <div className="user">
            <img src="images/pic-4.jpg" alt="" />
            <div>
              <h3>john deo</h3>
              <span>22-10-2022</span>
            </div>
          </div>
          <div className="comment-box">loved it, thanks for the tutorial!</div>
        </div>

        <div className="box">
          <div className="user">
            <img src="images/pic-5.jpg" alt="" />
            <div>
              <h3>john deo</h3>
              <span>22-10-2022</span>
            </div>
          </div>
          <div className="comment-box">
            this is what I have been looking for! thank you so much!
          </div>
        </div>

        <div className="box">
          <div className="user">
            <img src="images/pic-2.jpg" alt="" />
            <div>
              <h3>john deo</h3>
              <span>22-10-2022</span>
            </div>
          </div>
          <div className="comment-box">
            thanks for the tutorial! how to download source code file?
          </div>
        </div>
      </div>
    </section>
  );
};

export default LessonComments;
