import React from "react";
import Box from "../../utils/Box";
import { useAppSelector } from "../../state";
import InlineButton from "../../utils/InlineButton";
import Category from "../../utils/Category";
import CodeOffRoundedIcon from "@mui/icons-material/CodeOffRounded";
import AutoGraphRoundedIcon from "@mui/icons-material/AutoGraphRounded";
import PaletteIcon from "@mui/icons-material/Palette";
import StorefrontIcon from "@mui/icons-material/Storefront";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import CameraEnhanceIcon from "@mui/icons-material/CameraEnhance";
import "./quickOptions.scss";

const QuickOptions = () => {
  const { likes, comments, playlists } = useAppSelector((state) => state.user);
  const isSearched = useAppSelector((state) => state.courses.isSearched);
  return (
    <>
      {!isSearched && (
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
              <div className="categories">
                <Category name="development" icon={<CodeOffRoundedIcon />} />
                <Category name="business" icon={<AutoGraphRoundedIcon />} />
                <Category name="design" icon={<PaletteIcon />} />
                <Category name="marketing" icon={<StorefrontIcon />} />
                <Category name="music" icon={<MusicNoteIcon />} />
                <Category name="photography" icon={<CameraEnhanceIcon />} />
              </div>
            </div>

            <div className="box">
              <h3 className="title">popular topics</h3>
              <div className="categories">
                <Category name="HTML" icon={<i className="fab fa-html5"></i>} />
                <Category name="CSS" icon={<i className="fab fa-css3"></i>} />
                <Category
                  name="javascript"
                  icon={<i className="fab fa-js"></i>}
                />
                <Category
                  name="react"
                  icon={<i className="fab fa-react"></i>}
                />
                <Category name="PHP" icon={<i className="fab fa-php"></i>} />
                <Category
                  name="python"
                  icon={<i className="fa-brands fa-python"></i>}
                />
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
      )}
    </>
  );
};

export default QuickOptions;
