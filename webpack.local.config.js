var base = require("./webpack.base.config");
var webpack = require("webpack");

var config = base({
  devtool: "cheap-inline-sourcemap",

  output: {
    publicPath: "/"
  },

  devServer: {
    port: 8081,
    historyApiFallback: true
  },

  plugins: [
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": "'development'",
      "process.env.ROOT_ROUTE": "'/'",
      "process.env.SUBSITE": '"' + process.env.SUBSITE + '"'
    })
  ],

  module: {
    loaders: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loaders: ["react-hot", "babel-loader"]
      },
      {
        test: /\.(css|scss)$/,
        loader:
          'style-loader!css-loader?camelCase&modules&importLoaders=3&localIdentName=[name]__[local]__[hash:6]!autoprefixer?{browsers:["last 2 version", "ie>=10"]}!resolve-url-loader!sass-loader?sourceMap'
      }
    ]
  }
});

module.exports = config;
