import React from 'react'
import CourseInfo from '../components/CourseInfo/CourseInfo'
import { useLocation, useParams } from 'react-router'

const CoursePage = () => {
  const params = useLocation()
  console.log(params)
  return (
    <>
      <CourseInfo/>
    </>
  )
}

export default CoursePage