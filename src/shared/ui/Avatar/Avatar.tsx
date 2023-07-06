import {
  type HTMLAttributes,
  type FC
} from 'react';

import styles from './Avatar.module.scss';

interface AvatarProps extends HTMLAttributes<HTMLImageElement> {
  className?: string;
  size?: number;
  src?: string;
  alt?: string;
}

export const Avatar: FC<AvatarProps> = ({ className, size, ...otherProps }) => {
  return (
    <img className={styles.avatar} {...otherProps} />
  );
};
