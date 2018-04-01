const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

module.exports = {
  entry: ['webpack-hot-middleware/client', './entry.js'],
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.APP_PATH': JSON.stringify('./app'),
    }),

    new HtmlWebpackPlugin(),
    new webpack.HotModuleReplacementPlugin(),
  ],
};
