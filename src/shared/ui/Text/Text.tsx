import {
  type ReactNode,
  memo
} from 'react';
import styles from './Text.module.scss';

export type TextVariant = 'primary' | 'light' | 'accent';

export type TextSize = 's' | 'm' | 'l' | 'xl';

interface TextProps {
  className?: string;
  size?: TextSize;
  children?: ReactNode;
  variant?: TextVariant;
  bold?: boolean;
}

export const Text = memo((props: TextProps) => {
  const {
    className,
    size = 'm',
    variant = 'primary',
    bold = false,
    children,
  } = props;

  return (
    <div className={`${styles[size]} ${styles[variant]} 
    ${bold && styles.bold} ${className}`}>
      {children}
    </div>
  );
});
