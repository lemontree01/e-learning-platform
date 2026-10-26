import { Color } from '../types/Color';

type ThemeToken = 'page' | 'surface' | 'raised' | 'ink' | 'muted' | 'accent' |
'accent-fill' | 'on-accent' | 'line' | 'control-line' | 'positive' |
'overlay' | 'image-ink' | 'image-shade' | 'syntax-keyword' | 'syntax-string' |
'syntax-number' | 'syntax-function' | 'syntax-definition' | 'syntax-property' | 'syntax-type';

interface ThemeConfig {
  colorScheme: 'dark' | 'light';
  colors: Record<ThemeToken, string>;
}

export const DEFAULT_THEME = Color.DARK;

// The single source of truth for application colors. Components consume CSS variables.
export const themes: Record<Color, ThemeConfig> = {
  [Color.DARK]: {
    colorScheme: 'dark',
    colors: {
      page: '#000000',
      surface: '#0a0a0a',
      raised: '#171717',
      ink: '#f5f5f5',
      muted: '#a3a3a3',
      accent: '#ffffff',
      'accent-fill': '#ffffff',
      'on-accent': '#000000',
      line: '#262626',
      'control-line': '#666666',
      positive: '#d4d4d4',
      overlay: 'rgba(0, 0, 0, 0.7)',
      'image-ink': '#ffffff',
      'image-shade': 'rgba(0, 0, 0, 0.6)',
      'syntax-keyword': '#c4a7ff',
      'syntax-string': '#9bd59f',
      'syntax-number': '#eebc83',
      'syntax-function': '#86cfff',
      'syntax-definition': '#f5adc9',
      'syntax-property': '#d9b982',
      'syntax-type': '#82d9cf',
    },
  },
  [Color.LIGHT]: {
    colorScheme: 'light',
    colors: {
      page: '#ffffff',
      surface: '#ffffff',
      raised: '#f5f5f5',
      ink: '#111111',
      muted: '#666666',
      accent: '#111111',
      'accent-fill': '#111111',
      'on-accent': '#ffffff',
      line: '#e5e5e5',
      'control-line': '#888888',
      positive: '#404040',
      overlay: 'rgba(0, 0, 0, 0.4)',
      'image-ink': '#ffffff',
      'image-shade': 'rgba(0, 0, 0, 0.6)',
      'syntax-keyword': '#7538a3',
      'syntax-string': '#246b38',
      'syntax-number': '#955322',
      'syntax-function': '#005f9e',
      'syntax-definition': '#954067',
      'syntax-property': '#87500d',
      'syntax-type': '#226e66',
    },
  },
};
