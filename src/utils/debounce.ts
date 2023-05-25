type DebounceFunction<T extends (...args: any[]) => any> = (
  fn: T,
  delay: number
) => T;

export const debounce: DebounceFunction<(...args: any[]) => void> = (fn, delay) => {
  let timerId: NodeJS.Timeout | null;

  return ((...args: any[]) => {
    if (timerId) {
      clearTimeout(timerId);
    }

    timerId = setTimeout(() => {
      fn(...args);
      timerId = null;
    }, delay);
  }) as any;
};