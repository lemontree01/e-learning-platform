declare module '*.scss' {
  type IClassNames = Record<string, string>
  const classNames: IClassNames;
  export = classNames
}

declare module '*.jpg' {
  const src: string;
  export default src;
}

declare module '*.jpeg' {
  const src: string;
  export default src;
}

declare module '*.png' {
  const src: string;
  export default src;
}

declare module '*.webp' {
  const src: string;
  export default src;
}

// declare module '*.png';
// declare module '*.jpg';
// declare module '*.jpeg';
// declare module '*.svg' {
//   const SVG: React.FC<React.SVGProps<SVGSVGElement>>;
//   export default SVG;
// }
