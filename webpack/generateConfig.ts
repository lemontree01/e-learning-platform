import { generateDevServer } from './generateDevServer';
import { generateLoaders } from './generateLoaders';
import { generatePlugins } from './generatePlugins';
import { generateResolvers } from './generateResolvers';
import { type BuildOptions } from './types';
import type webpack from 'webpack';

export function generateConfig (options: BuildOptions): webpack.Configuration {
  const { paths, mode, isDev, } = options;
  return {
    mode,
    context: paths.context,
    entry: paths.entry,
    output: {
      filename: '[name].[contenthash].js',
      path: paths.output,
      clean: true,
    },
    plugins: generatePlugins(options),
    module: {
      rules: generateLoaders(options),
    },
    resolve: generateResolvers(options),
    devtool: isDev ? 'inline-source-map' : undefined,
    devServer: isDev ? generateDevServer(options) : undefined,
  };
}
