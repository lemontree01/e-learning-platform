import { Skeleton } from '@mui/material'
import React from 'react'

const LessonLoading = () => {
  return (
      <div className="box">
        <Skeleton height={250}/>
      </div>
  )
}

export default LessonLoading