/* eslint-disable @typescript-eslint/no-base-to-string */
/* eslint-disable no-prototype-builtins */
type classType = string | number | boolean | null | undefined | Record<string, any>;

export function classNames (...args: classType[]): string {
  const classes: string[] = [];

  args.forEach((arg) => {
    if (!arg) return;
    if (typeof arg === 'string' || typeof arg === 'number') {
      classes.push(arg.toString());
    } else if (Array.isArray(arg)) {
      if (arg.length) {
        const inner = classNames.apply(null, arg);
        if (inner) {
          classes.push(inner);
        }
      }
    } else if (typeof arg === 'object') {
      if (arg.toString !== Object.prototype.toString &&
        !arg.toString.toString().includes('[native code]')) {
        classes.push(arg.toString());
        return;
      }

      for (const key in arg) {
        if ({}.hasOwnProperty.call(arg, key) && arg[key]) {
          classes.push(key);
        }
      }
    }
  });

  return classes.join(' ');
}
