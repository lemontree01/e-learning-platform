import type webpack from 'webpack';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { type BuildOptions } from './types';

export function generateLoaders ({
  isDev,
}: BuildOptions): webpack.RuleSetRule[] {
  const svgLoader: webpack.RuleSetRule = {
    test: /\.svg$/,
    use: ['@svgr/webpack'],
  };

  const fileLoader: webpack.RuleSetRule = {
    test: /\.(png|jpe?g|gif)$/i,
    use: ['file-loader'],
  };

  const typescriptLoader: webpack.RuleSetRule = {
    test: /\.tsx?$/,
    use: 'ts-loader',
    exclude: /node_modules/,
  };

  const styleLoader: webpack.RuleSetRule = {
    test: /\.s[ac]ss$/i,
    use: [
      isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
      {
        loader: 'css-loader',
        options: {
          modules: {
            auto: /\.module\.scss$/,
            localIdentName: isDev
              ? '[path][name]__[local]--[hash:base64:5]'
              : '[hash:base64:8]',
          },
        },
      },
      'sass-loader'

      // 'style-loader',
      // 'css-loader',
      // 'sass-loader',
      // {
      //   loader: "sass-resources-loader",
      //   options: {
      //     resources: [
      //       path.resolve(__dirname, "../src/styles/config.scss"),
      //     ],
      //   },
      // },
    ],
  };

  const babelLoader: webpack.RuleSetRule = {
    test: /\.(js|jsx|tsx)$/,
    exclude: /node_modules/,
    use: {
      loader: 'babel-loader',
      options: {
        presets: ['@babel/preset-env'],
        plugins: [
          ['i18next-extract', {
            locales: [
              'ru',
              'en'
            ],
            keyAsDefaultValue: true,
          }]],
      },
    },
  };

  return [svgLoader, fileLoader, babelLoader, typescriptLoader, styleLoader];
}
