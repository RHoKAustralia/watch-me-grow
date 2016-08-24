var base = require('./webpack.base.config');
var webpack = require('webpack');

var config = base({
    devtool: "cheap-inline-sourcemap",

    output: {
        publicPath: "http://localhost:8080/"
    },

    devServer: {
        port: 8080,
        historyApiFallback: true
    },

    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': "'development'",
            'process.env.ROOT_ROUTE': "'/'"
        })
    ],

    module: {
        loaders: [
            {test: /\.(js|jsx)$/, exclude: /node_modules/, loaders: ["react-hot", "babel-loader"]},
            {
                test: /\.(css|scss)$/,
                loader: 'style-loader!css-loader?camelCase&modules&importLoaders=2&localIdentName=[name]__[local]__[hash:6]!resolve-url-loader!sass-loader?sourceMap'
            }
        ]
    }
});

module.exports = config;
