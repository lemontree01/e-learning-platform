import React from 'react'
import { Link } from 'react-router-dom'
import "./category.scss"

interface CategoryProps {
  name: string,
  icon: React.ReactNode
}

const Category: React.FC<CategoryProps> = ({name, icon}) => {
  return (
    <div className='category'>
      {icon}
      <span>{name}</span>
    </div>
  )
}

export default Category