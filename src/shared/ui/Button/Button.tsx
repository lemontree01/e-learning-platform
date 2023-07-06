import {
  type ReactNode,
  type ButtonHTMLAttributes,
  forwardRef,
  type ForwardedRef
} from 'react';
import styles from './Button.module.scss';

export type ButtonVariant = 'outlined' | 'filled' | 'clear';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: ReactNode;
  variant?: ButtonVariant;
  className?: string;
  children?: ReactNode;
}

export const Button = forwardRef(
  (props: ButtonProps, ref: ForwardedRef<HTMLButtonElement>) => {
    const { children, variant = 'filled', icon, ...otherProps } = props;
    return (<button type="button" className={styles[variant]}
    {...otherProps} ref={ref}>
      {icon}
      {children}
      </button>
    );
  }
);
