const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin  = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const environment = process.env.NODE_ENV ? process.env.NODE_ENV : 'development';

module.exports = {
  mode: environment,
  entry: path.resolve(__dirname, 'src/index.js'),
  output: {
    path: path.resolve(__dirname, 'tmp'),
    filename: 'afosto-instant-search.min.js',
    library: 'afostoInstantSearch',
    libraryExport: 'default',
    globalObject: 'window',
  },
  optimization: {
    minimize: environment === 'production',
  },
  devServer: {
    host: 'localhost',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            plugins: ['@babel/plugin-transform-runtime'],
          },
        },
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    ...(environment === 'development' ? [
      new HtmlWebpackPlugin({
        inject: 'body',
        template: 'playground/index.html',
      }),
      new webpack.HotModuleReplacementPlugin(),
    ] : []),
  ]
};
