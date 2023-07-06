import React from 'react';
import Skeleton from '@mui/material/Skeleton';

const CourseLoading = () => {
  return (
    <div className="box course">
      <div className="tutor">
        <Skeleton width={55} height={55} variant="circular" />
        <div className="info">
          <Skeleton width={200} height={20} variant="rectangular" />
          <br />

          <Skeleton width={100} height={20} variant="rectangular" />
        </div>
      </div>
      <div className="thumb">
        <Skeleton width={300} height={200} variant="rectangular" />
        <img src="images/thumb-6.png" alt="" style={{ visibility: 'hidden', }} />
      </div>
      <br/>
      <br />
      <br />
      <Skeleton width={250} height={25} variant="rectangular" />
      <br />
      <Skeleton width={150} height={35} variant="rectangular" />
    </div>
  );
};

export default CourseLoading;
