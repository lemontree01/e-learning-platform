const { merge } = require('webpack-merge');
const common = require("./webpack.common")
const path = require("path")

module.exports = merge(common, {
  mode: "development",
  devServer: {
    historyApiFallback: true,
    static: {
      directory: path.join(__dirname, "/"),
    },
    port: 8081,
    open: true,
  },
})