import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './courseInfo.scss';
import { Skeleton } from '@mui/material';
import { useSelector } from 'react-redux';
import { type Course, getCurrentCourse } from '~/entities/Course';
import { avatars } from '~/shared/assets/avatars';
import { useAppDispatch } from '~/app/providers/StoreProvider';

const CourseInfo = () => {
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useAppDispatch();

  const course: Course = useSelector(getCurrentCourse) ??
  JSON.parse(localStorage.getItem('current-course') ?? '');

  useEffect(() => {
    localStorage.setItem('current-course', JSON.stringify(course));
  }, [dispatch, course]);

  return (
    <>
      <section className="playlist-details">
        <h1 className="heading">Course Info</h1>
        <div className="row">
          <div className="column">
            <div className="save-playlist">
              <button>
                <i className="far fa-bookmark"></i> <span>save course</span>
              </button>
            </div>

            <div className="thumb">
              {isLoading && <Skeleton width={'100%'} height={'30rem'} />}
              <img
                onLoad={() => { setIsLoading(false); }}
                src={`${process.env.SERVER_URL ??
        'https://sleepy-jay-bracelet.cyclic.app'}/course-${course.id}.jpg`}
                alt=""
                style={{ visibility: isLoading ? 'hidden' : 'visible', }}
              />
              <span>{course.numberOfLessons} videos</span>
            </div>
          </div>
          <div className="column">
            <div className="tutor">
              <img src={avatars[course.id % 9]} alt="" />
              <div>
                <h3>{course.author}</h3>
                <span>{course.date}</span>
              </div>
            </div>

            <div className="details">
              <h3>{course.name}</h3>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Illum
                minus reiciendis, error sunt veritatis exercitationem deserunt
                velit doloribus itaque voluptate.
              </p>
              <Link to="/home" className="inline-btn">
                Back
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="playlist-videos">
        <h1 className="heading">Course lessons</h1>

        <div className="box-container">
          {Array(course.numberOfLessons)
            .fill(1)
            .map((_, num: number) => (
              <Link key={num} className="box" to={`/lesson/${num}`}>
                <i className="fas fa-play"></i>
                <img
                  src={`${process.env.SERVER_URL ??
            'https://sleepy-jay-bracelet.cyclic.app'}/course-${course.id}.jpg`}
                  alt=""
                />
                <h3>
                  {course.name} (part {num + 1})
                </h3>
              </Link>
            ))}
        </div>
      </section>
    </>
  );
};

export default CourseInfo;
