import React from "react";
import Box from "../../utils/Box";
import { useAppSelector } from "../../state";
import InlineButton from "../../utils/InlineButton";
import Category from "../../utils/Category";
import CodeOffRoundedIcon from '@mui/icons-material/CodeOffRounded';
import AutoGraphRoundedIcon from '@mui/icons-material/AutoGraphRounded';

const QuickOptions = () => {
  const { likes, comments, playlists } = useAppSelector((state) => state.user);
  return (
    <section className="home-grid">
      <h1 className="heading">quick options</h1>
      <div className="box-container">
        <Box>
          <h3 className="title">likes and comments</h3>
          <p className="likes">
            total likes : <span>{likes.length}</span>
          </p>
          <InlineButton>view likes</InlineButton>
          <p className="likes">
            total comments : <span>{comments.length}</span>
          </p>
          <InlineButton>view comments</InlineButton>
          <p className="likes">
            saved playlists : <span>{playlists.length}</span>
          </p>
          <InlineButton>view playlists</InlineButton>
        </Box>

        <div className="box">
          <h3 className="title">top categories</h3>
          <div className="flex">
           
            <Category name="development" icon={<CodeOffRoundedIcon/>} />
            <Category name="business" icon={<AutoGraphRoundedIcon/>}  />
              
            
            <a href="#">
              <i className="fas fa-pen"></i>
              <span>design</span>
            </a>
            <a href="#">
              <i className="fas fa-chart-line"></i>
              <span>marketing</span>
            </a>
            <a href="#">
              <i className="fas fa-music"></i>
              <span>music</span>
            </a>
            <a href="#">
              <i className="fas fa-camera"></i>
              <span>photography</span>
            </a>
            <a href="#">
              <i className="fas fa-cog"></i>
              <span>software</span>
            </a>
            <a href="#">
              <i className="fas fa-vial"></i>
              <span>science</span>
            </a>
          </div>
        </div>

        <div className="box">
          <h3 className="title">popular topics</h3>
          <div className="flex">
            <a href="#">
              <i className="fab fa-html5"></i>
              <span>HTML</span>
            </a>
            <a href="#">
              <i className="fab fa-css3"></i>
              <span>CSS</span>
            </a>
            <a href="#">
              <i className="fab fa-js"></i>
              <span>javascript</span>
            </a>
            <a href="#">
              <i className="fab fa-react"></i>
              <span>react</span>
            </a>
            <a href="#">
              <i className="fab fa-php"></i>
              <span>PHP</span>
            </a>
            <a href="#">
              <i className="fab fa-bootstrap"></i>
              <span>bootstrap</span>
            </a>
          </div>
        </div>

        <div className="box">
          <h3 className="title">become a tutor</h3>
          <p className="tutor">
            Want to become a tutor? Click the button below
          </p>
          <a href="teachers.html" className="inline-btn">
            get started
          </a>
        </div>
      </div>
    </section>
  );
};

export default QuickOptions;
