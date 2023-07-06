import { type FC, type ReactNode } from 'react';
import styles from './Icon.module.scss';

interface IconProps {
  icon: ReactNode;
}

export const Icon: FC<IconProps> = ({ icon, }) => {
  return (
    <div className={styles.icon}>
      {icon}
    </div>
  );
};
