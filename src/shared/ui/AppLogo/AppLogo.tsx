import { type FC, type HTMLAttributes } from 'react';
import styles from './AppLogo.module.scss';

export const AppLogo: FC<HTMLAttributes<HTMLDivElement>> = ({ children, }) => {
  return (
    <div className={styles.logo}>
      {children}
    </div>
  );
};
