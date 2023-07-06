declare module '*.scss' {
  type IClassNames = Record<string, string>
  const classNames: IClassNames;
  export = classNames
}

// declare module '*.png';
// declare module '*.jpg';
// declare module '*.jpeg';
// declare module '*.svg' {
//   const SVG: React.FC<React.SVGProps<SVGSVGElement>>;
//   export default SVG;
// }

declare const IS_DEV: boolean;
