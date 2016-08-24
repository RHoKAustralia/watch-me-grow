var base = require('./webpack.base.config');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var webpack = require('webpack');

module.exports = base({
    devtool: "sourcemap",

    output: {
        publicPath: "/"
    },

    // Necessary plugins for hot load
    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': "'production'",
            'process.env.ROOT_ROUTE': "'/'"
        }),
        new ExtractTextPlugin("styles.css"),
        new webpack.optimize.UglifyJsPlugin(),
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.optimize.DedupePlugin()
    ],

    // Transform source code using Babel and React Hot Loader
    module: {
        loaders: [
            {test: /\.(js|jsx)$/, exclude: /node_modules/, loaders: ["babel-loader"]},
            {
                test: /\.(scss|css)$/,
                loader: ExtractTextPlugin.extract('css-loader?camelCase&modules&importLoaders=3&localIdentName=[name]__[local]__[hash]!autoprefixer?{browsers:["last 2 version", "ie>=10"]}!resolve-url-loader!sass-loader?sourceMap')
            }
        ]
    }
});
