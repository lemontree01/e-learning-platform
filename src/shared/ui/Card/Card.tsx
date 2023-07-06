import {
  type HTMLAttributes, memo, type ReactNode
} from 'react';
import styles from './Card.module.scss';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  className?: string;
  children: ReactNode;
}

export const Card = memo((props: CardProps) => {
  const {
    className,
    children,
    ...otherProps
  } = props;
  return (
    <div className={`${styles.card} ${className}`} {...otherProps}>
      {children}
    </div>
  );
});
