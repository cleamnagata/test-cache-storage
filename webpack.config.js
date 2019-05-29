const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const DIST = path.join(__dirname, 'dist');

module.exports = {
  mode: 'development',
  entry: path.join(__dirname, 'src', 'js', 'index.js'),
  output: {
    path: DIST
  },
  devServer: {
    contentBase: DIST,
    port: 9000,
    disableHostCheck: true, // for private ip access
  },
  plugins: [
    new CopyWebpackPlugin([
      { from: path.join(__dirname, 'assets/*'), to: path.join(DIST) },
      { from: path.join(__dirname, 'src', 'js', 'sw', 'worker.js') },
    ]),
    new HtmlWebpackPlugin()
  ]
};
