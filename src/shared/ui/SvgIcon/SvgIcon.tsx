import { type SVGProps } from 'react';
import styles from './SvgIcon.module.scss';

// Glyphs retain the existing Material icons. See LICENSE for their MIT attribution.
type IconProps = Omit<SVGProps<SVGSVGElement>, 'children'>;

function SvgIcon ({ path, className, ...props }: IconProps & { path: string }) {
  return (
    <svg className={[styles.icon, className].filter(Boolean).join(' ')}
      viewBox="0 0 24 24" aria-hidden="true" focusable="false" {...props}>
      <path d={path} />
    </svg>
  );
}

export const ArrowBackIcon = (props: IconProps) => (
  <SvgIcon {...props} path={
    'M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20z'
  } />
);

export const ArrowForwardIcon = (props: IconProps) => (
  <SvgIcon {...props} path={
    'm12 4-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z'
  } />
);

export const AutoStoriesOutlinedIcon = (props: IconProps) => (
  <SvgIcon {...props} path={
    'M22.47 5.2c-.47-.24-.96-.44-1.47-.61v12.03c-1.14-.41-2.31-.62-3.5-.62-1.9 0-3.78' +
    '.54-5.5 1.58V5.48C10.38 4.55 8.51 4 6.5 4c-1.79 0-3.48.44-4.97 1.2-.33.16-.53.51' +
    '-.53.88v12.08c0 .58.47.99 1 .99.16 0 .32-.04.48-.12C3.69 18.4 5.05 18 6.5 18c2.0' +
    '7 0 3.98.82 5.5 2 1.52-1.18 3.43-2 5.5-2 1.45 0 2.81.4 4.02 1.04.16.08.32.12.48.' +
    '12.52 0 1-.41 1-.99V6.08c0-.37-.2-.72-.53-.88M10 16.62C8.86 16.21 7.69 16 6.5 16' +
    's-2.36.21-3.5.62V6.71C4.11 6.24 5.28 6 6.5 6c1.2 0 2.39.25 3.5.72zM19 .5l-5 5V15' +
    'l5-4.5z'
  } />
);

export const CloseIcon = (props: IconProps) => (
  <SvgIcon {...props} path={
    'M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 ' +
    '19 19 17.59 13.41 12z'
  } />
);

export const DarkModeIcon = (props: IconProps) => (
  <SvgIcon data-testid="DarkModeIcon" {...props} path={
    'M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9c0-.46-.04-.92-.1-1.36-.98 1.37-2.' +
    '58 2.26-4.4 2.26-2.98 0-5.4-2.42-5.4-5.4 0-1.81.89-3.42 2.26-4.4-.44-.06-.9-.1-1' +
    '.36-.1'
  } />
);

export const LightModeIcon = (props: IconProps) => (
  <SvgIcon data-testid="LightModeIcon" {...props} path={
    'M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5M2 13h2c.55 0 1-.45 1-1' +
    's-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1m18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.' +
    '55 0-1 .45-1 1s.45 1 1 1M11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .4' +
    '5-1 1m0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1M5.99 4.58c-.' +
    '39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.3' +
    '9-1.03 0-1.41zm12.37 12.37c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l1.06 ' +
    '1.06c.39.39 1.03.39 1.41 0 .39-.39.39-1.03 0-1.41zm1.06-10.96c.39-.39.39-1.03 0-' +
    '1.41-.39-.39-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0zM' +
    '7.05 18.36c.39-.39.39-1.03 0-1.41-.39-.39-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39' +
    ' 1.03 0 1.41s1.03.39 1.41 0z'
  } />
);

export const MenuIcon = (props: IconProps) => (
  <SvgIcon {...props} path={
    'M3 18h18v-2H3zm0-5h18v-2H3zm0-7v2h18V6z'
  } />
);

export const PersonIcon = (props: IconProps) => (
  <SvgIcon {...props} path={
    'M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4m0 2c-2.67 0-8 1.34-8 ' +
    '4v2h16v-2c0-2.66-5.33-4-8-4'
  } />
);

export const PersonOutlineIcon = (props: IconProps) => (
  <SvgIcon {...props} path={
    'M12 5.9c1.16 0 2.1.94 2.1 2.1s-.94 2.1-2.1 2.1S9.9 9.16 9.9 8s.94-2.1 2.1-2.1m0 ' +
    '9c2.97 0 6.1 1.46 6.1 2.1v1.1H5.9V17c0-.64 3.13-2.1 6.1-2.1M12 4C9.79 4 8 5.79 8' +
    ' 8s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4m0 9c-2.67 0-8 1.34-8 4v3h16v-3c0-2.66-5.33-4' +
    '-8-4'
  } />
);

export const SearchIcon = (props: IconProps) => (
  <SvgIcon {...props} path={
    'M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 ' +
    '3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19zm-6 0C' +
    '7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14'
  } />
);

export const TranslateIcon = (props: IconProps) => (
  <SvgIcon {...props} path={
    'm12.87 15.07-2.54-2.51.03-.03c1.74-1.94 2.98-4.17 3.71-6.53H17V4h-7V2H8v2H1v1.99' +
    'h11.17C11.5 7.92 10.44 9.75 9 11.35 8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 ' +
    '3.17 2.98 4.56l-5.09 5.02L4 19l5-5 3.11 3.11zM18.5 10h-2L12 22h2l1.12-3h4.75L21 ' +
    '22h2zm-2.62 7 1.62-4.33L19.12 17z'
  } />
);
