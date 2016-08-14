var debug = process.env.NODE_ENV !== "production";
var path = require('path');
var webpack = require('webpack');

module.exports = {
  cache: true,
  context: path.join(__dirname, "frontend"),
  devtool: debug ? "inline-sourcemap" : null,
  entry: "./js/components/App.jsx",
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
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          sequences: true,
          dead_code: true,
          conditionals: true,
          booleans: true,
          unused: true,
          if_return: true,
          join_vars: true,
          drop_console: false
        },
        mangle: true,
        output: {
          comments: false
        }
      }),
    ],
};
