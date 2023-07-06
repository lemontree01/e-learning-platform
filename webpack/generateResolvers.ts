import type webpack from 'webpack';
import { type BuildOptions } from './types';
export function generateResolvers (options: BuildOptions): webpack.ResolveOptions {
  return {
    extensions: ['.tsx', '.ts', '.js'],
    preferAbsolute: true,
    modules: [options.paths.src, 'node_modules'],
    mainFiles: ['index'],
    alias: {
      '~': options.paths.src,
    },
  };
}
