const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
// const Dotenv = require("dotenv-webpack");
const webpack = require("webpack");

module.exports = {
  entry: path.resolve(__dirname, "../src/index.tsx"),
  resolve: {
    extensions: [".js", ".ts", ".tsx", ".jsx"],
  },
  output: {
    path: path.resolve(__dirname, "../dist"),
    filename: "bundle.js",
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "../public/index.html"),
    }),
    // new Dotenv({
    //   systemvars: true,
    // }),
    // new webpack.LoaderOptionsPlugin({
    //   options: {
    //     sassResources: [path.resolve(__dirname, "../src/styles/color.scss")],
    //   },
    // }),
  ],
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: "ts-loader",
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              "@babel/preset-env",
              "@babel/preset-react",
              "@babel/preset-typescript",
            ],
          },
        },
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          "style-loader",
          "css-loader",
          "sass-loader",
          // {
          //   loader: "sass-resources-loader",
          //   // options: {
          //   //   resources: [
          //   //     path.resolve(__dirname, "../src/styles/colors.scss"),
          //   //     path.resolve(__dirname, "../src/styles/sizes.scss"),
          //   //   ],
          //   // },
          // },
        ],
      },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(png|svg|jpg)$/i,
        type: "asset/resource",
      },
    ],
  },
};
