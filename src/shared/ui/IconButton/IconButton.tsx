import { type FC, type ButtonHTMLAttributes } from 'react';
import styles from './IconButton.module.scss';

export const IconButton: FC<ButtonHTMLAttributes<HTMLButtonElement>> =
  ({ children, ...props }) => {
    return <button type='button' className={styles.icon} {...props}>{children}</button>;
  };
