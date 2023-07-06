import { type FC, type HTMLAttributes } from 'react';
import styles from './IconButton.module.scss';

export const IconButton: FC<HTMLAttributes<HTMLDivElement>> =
  ({ children, ...props}) => {
    return <div className={styles.icon} {...props}>{children}</div>;
  };
