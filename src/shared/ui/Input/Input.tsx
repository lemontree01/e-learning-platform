import {
  memo,
  type InputHTMLAttributes,
  useRef,
  useEffect,
  type ReactNode
} from 'react';
import styles from './Input.module.scss';

interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'> {
  className?: string;
  value?: string;
  onChange?: (value: string) => void;
  autofocus?: boolean;
  addonLeft?: ReactNode;
  addonRight?: ReactNode;
}

export const Input = memo((props: InputProps) => {
  const {
    addonLeft,
    addonRight,
    className,
    value,
    onChange,
    autofocus,
    placeholder,
    ...otherProps
  } = props;
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (autofocus) ref.current?.focus();
  }, [autofocus]);

  const onChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(event.target.value);
  };

  const focusFromField = (event: React.MouseEvent<HTMLDivElement>) => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    if (target.closest('input, textarea, select, button, a')) return;
    event.preventDefault();
    ref.current?.focus();
  };

  return (
    <div className={styles.input} onMouseDown={focusFromField}>
      {addonLeft}
      <input
        ref={ref}
        value={value}
        onChange={onChangeHandler}
        className={className}
        placeholder={placeholder}
        {...otherProps}
      />
      {addonRight}
    </div>
  );
});
