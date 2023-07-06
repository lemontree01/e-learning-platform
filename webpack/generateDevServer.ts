import { type BuildOptions } from './types';
import { type Configuration } from 'webpack-dev-server';

export function generateDevServer (options: BuildOptions): Configuration {
  return {
    port: options.port,
    open: true,
    historyApiFallback: true,
    hot: true,
  };
}
