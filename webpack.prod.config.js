var base = require('./webpack.base.config');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var webpack = require('webpack');

module.exports = base({
    devtool: "sourcemap",

    output: {
        publicPath: "/watch-me-grow/"
    },

    // Necessary plugins for hot load
    plugins: [
        new webpack.DefinePlugin({
            // 'process.env.NODE_ENV': "'production'",
            'process.env.ROOT_ROUTE': "'/watch-me-grow'"
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
                loader: ExtractTextPlugin.extract("css-loader?camelCase&modules&importLoaders=2&localIdentName=[name]__[local]__[hash]!resolve-url-loader!sass-loader?sourceMap")
            }
        ]
    }
});
