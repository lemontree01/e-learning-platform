import {
  memo,
  type InputHTMLAttributes,
  useRef,
  useState,
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
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (autofocus) {
      setIsFocused(true);
      ref.current?.focus();
    }
  }, [autofocus]);

  const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(e.target.value);
  };

  const onBlur = () => {
    setIsFocused(false);
  };

  const onFocus = () => {
    setIsFocused(true);
  };

  return (
    <div className={`${styles.input} ${isFocused && styles.focused}`}>
      {addonLeft}
      <input
        ref={ref}
        value={value}
        onChange={onChangeHandler}
        className={className}
        onFocus={onFocus}
        onBlur={onBlur}
        placeholder={placeholder}
        {...otherProps}
      />
      {addonRight}
    </div>
  );
});
