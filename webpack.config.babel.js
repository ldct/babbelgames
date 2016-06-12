var debug = process.env.NODE_ENV !== "production";
var path = require('path');
var webpack = require('webpack');

module.exports = {
  cache: true,
  context: path.join(__dirname, "frontend"),
  devtool: debug ? "inline-sourcemap" : null,
  entry: "./js/components/App.jsx",
  externals: {
      // require("jquery") is external and available on the global var jQuery
      "jquery": "jQuery"
  },
  module: {
    loaders: [
      // Extract css files
      {
          test: /\.css$/,
          loader: 'style!css?modules&localIdentName=[name]---[local]---[hash:base64:5]'
      },

      {
        test: /\.jsx?$/, // A regexp to test the require path. accepts either js or jsx
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader',
        query: {
          presets: ['react', 'es2015']
        }
      }
    ]
  },
  output: {
    path: __dirname + "/frontend/",
    filename: "./js/bundle.min.js"
  },
  plugins: debug ? [] : [
      new webpack.optimize.DedupePlugin(),
      new webpack.optimize.OccurenceOrderPlugin(),
      new webpack.optimize.UglifyJsPlugin({ mangle: false, sourcemap: false }),
    ],
};