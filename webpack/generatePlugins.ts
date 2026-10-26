import HtmlWebpackPlugin from 'html-webpack-plugin';
import webpack from 'webpack';
import { type BuildOptions } from './types';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import Dotenv from 'dotenv-webpack';
import path from 'path';
import { DEFAULT_THEME, themes } from '../src/shared/config/themes';
import { THEME_STORAGE_KEY } from '../src/shared/lib/theme/themeStorage';

export function generatePlugins (
  options: BuildOptions
): webpack.WebpackPluginInstance[] {
  const initialTheme = themes[DEFAULT_THEME];
  const initialThemeStyle = Object.entries(initialTheme.colors)
    .map(([token, value]) => `--${token}:${value}`).join(';');
  const plugins: webpack.WebpackPluginInstance[] = [
    new HtmlWebpackPlugin({
      template: options.paths.html,
      templateParameters: {
        initialThemeStyle: `${initialThemeStyle};color-scheme:${initialTheme.colorScheme};` +
          'background:var(--page);color:var(--ink)',
        initialThemeColor: initialTheme.colors.page,
        themeBootScript: `(function(){try{var themes=${JSON.stringify(themes)};` +
          `var color=localStorage.getItem(${JSON.stringify(THEME_STORAGE_KEY)});` +
          'var theme=themes[color];if(!theme)return;var root=document.documentElement;' +
          'for(var token in theme.colors){if(Object.prototype.hasOwnProperty.call(theme.colors,token))' +
          "root.style.setProperty('--'+token,theme.colors[token]);}" +
          'root.style.colorScheme=theme.colorScheme;root.dataset.theme=theme.colorScheme;' +
          'var meta=document.querySelector(\'meta[name="theme-color"]\');' +
          "if(meta)meta.setAttribute('content',theme.colors.page);}catch(e){}})();",
      },
    }),
    new MiniCssExtractPlugin({
      filename: 'styles/[name].[contenthash:8].css',
      chunkFilename: 'styles/[name].[contenthash:8].css',
    }),
    new webpack.DefinePlugin({ IS_DEV: JSON.stringify(options.isDev), }),
    new Dotenv({
      systemvars: true,
      defaults: path.join(options.paths.context, '.env.example'),
      silent: true,
    })
  ];
  if (options.isDev && process.env.ANALYZE === 'true') {
    plugins.push(
      new BundleAnalyzerPlugin({
        openAnalyzer: false,
      })
    );
  }

  return plugins;
}
