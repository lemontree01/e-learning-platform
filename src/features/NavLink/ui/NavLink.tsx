import { type ReactNode, type FC } from 'react';
import { Link } from 'react-router-dom';
import { type LinkProps } from 'react-router-dom';
import styles from './NavLink.module.scss';

interface NavLinkProps extends LinkProps {
  icon: ReactNode;
}

export const NavLink: FC<NavLinkProps> = (props) => {
  const { children, icon, className, ...otherProps } = props;
  return (
    <Link className={`${styles.link} ${className}`} {...otherProps}>
      {icon}
      <span>{children}</span>
    </Link>
  );
};
