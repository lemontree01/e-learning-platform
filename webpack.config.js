const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = [
  {
    entry: "./src/index.tsx",
    mode: "development",
    target: "web",
    output: {
      path: path.resolve(__dirname, "dist"),
      filename: "client_bundle.js",
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: "./public/index.html",
      }),
    ],
    resolve: {
      extensions: [".js", ".ts", ".tsx", ".jsx"],
    },
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
            {
              loader: 'sass-loader',
              options: {
                sassOptions: {
                  data: '@import url("./src/app.scss");',
                includePaths:[__dirname, 'src']
                }
              },
            },
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
    devServer: {
      historyApiFallback: true,
      static: {
        directory: path.join(__dirname, "/"),
      },
      port: 8081,
      open: true,
    },
  },
];
