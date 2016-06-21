var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var autoprefixer = require('autoprefixer');
var path = require('path');

/**
 * This is the Webpack configuration file for local development. It contains
 * local-specific configuration such as the React Hot Loader, as well as:
 *
 * - The entry point of the application
 * - Where the output file should be
 * - Which loaders to use on what files to properly transpile the source
 *
 * For more information, see: http://webpack.github.io/docs/configuration.html
 */
module.exports = {

  // Efficiently evaluate modules with source maps
  devtool: "cheap-inline-sourcemap",

  // Set entry point to ./src/main and include necessary files for hot load
  entry: [
    "./src/main"
  ],

  // This will not actually create a bundle.js file in ./build. It is used
  // by the dev server for dynamic hot loading.
  output: {
    path: __dirname + "/build/",
    filename: "app.js",
    publicPath: "http://localhost:8080/"
  },

  devServer: {
    port: 8080,
    historyApiFallback: true
  },

  sassLoader: {
    data: '@import "' + path.resolve(__dirname, 'src/common/theme.scss') + '";'
  },

  // Necessary plugins for hot load
  plugins: [
    // new webpack.NoErrorsPlugin(),
    // new ExtractTextPlugin('style.css', { allChunks: true }),
    new HtmlWebpackPlugin({
      title: 'Watch Me Grow',
      template: 'index.ejs' // Load a custom template (ejs by default but can be changed)
    })
  ],

  // Transform source code using Babel and React Hot Loader
  module: {
    loaders: [
      {test: /\.(js|jsx)$/, exclude: /node_modules/, loaders: ["react-hot", "babel-loader"]},
      {
        test: /\.(css|less)$/,
        loader: 'style-loader!css-loader?camelCase&modules&importLoaders=1&localIdentName=[name]__[local]!less-loader?sourceMap'
      },
      {
        test: /\.scss$/,
        loader: 'style-loader!css-loader?camelCase&modules&importLoaders=1&localIdentName=[name]__[local]!sass-loader?sourceMap'
      },
      {test: /\.(png|woff|woff2|ttf)$/, loader: "url-loader?limit=10000"}
    ]
  },

  // Automatically transform files with these extensions
  resolve: {
    extensions: ['', '.js', '.jsx', '.css', 'less']
  }
};