const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: path.resolve(__dirname, 'src', 'currency-converter.js'),
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.html',
    }),
  ],
  optimization: {
    minimize: false,
  },
  devtool: 'source-map',
  output: {
    path: path.resolve(__dirname, 'demo'),
    filename: 'bundle.[contenthash].js',
  },
  devServer: {
    watchContentBase: true,
    contentBase: path.resolve(__dirname, 'demo'),
    open: true,
  },
};
