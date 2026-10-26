import { type BuildOptions } from './types';
import { type Configuration } from 'webpack-dev-server';

export function generateDevServer (options: BuildOptions): Configuration {
  return {
    host: '127.0.0.1',
    allowedHosts: ['localhost', '127.0.0.1'],
    port: options.port,
    open: false,
    historyApiFallback: true,
    hot: true,
  };
}
