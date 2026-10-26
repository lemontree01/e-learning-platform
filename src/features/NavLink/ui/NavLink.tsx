import { type ComponentProps, type FC, type ReactNode } from 'react';
import Link from 'next/link';
import styles from './NavLink.module.scss';

interface NavLinkProps extends ComponentProps<typeof Link> {
  icon: ReactNode;
}

export const NavLink: FC<NavLinkProps> = (props) => {
  const { children, icon, className, ...otherProps } = props;
  return (
    <Link className={`${styles.link} ${className ?? ''}`} {...otherProps}>
      {icon}
      <span>{children}</span>
    </Link>
  );
};
