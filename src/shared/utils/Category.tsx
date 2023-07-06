import React from 'react';
import './category.scss';
import {
  Button
} from '~/shared/ui/Button';

interface CategoryProps {
  name: string;
  icon: React.ReactNode;
}

const Category: React.FC<CategoryProps> = ({ name, icon, }) => {
  return (
    // <div className='category'>
    //   {icon}
    //   <span>{name}</span>
    // </div>
    <Button variant={'outlined'} icon={icon}>
      {name}
    </Button>
  );
};

export default Category;
