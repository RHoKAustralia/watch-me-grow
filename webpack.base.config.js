var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var autoprefixer = require('autoprefixer');
var path = require('path');
var argv = require('yargs').argv;
var mergeWith = require('lodash/mergeWith');
var isArray = require('lodash/isArray');

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
module.exports = function(profileConfig) {
    return mergeWith({

        // Set entry point to ./src/main and include necessary files for hot load
        entry: [
            "whatwg-fetch",
            "./src/main"
        ],

        // This will not actually create a bundle.js file in ./build. It is used
        // by the dev server for dynamic hot loading.
        output: {
            path: path.resolve(__dirname, "watch-me-grow"),
            filename: "app.js"
        },
        // Necessary plugins for hot load
        plugins: [
            // new webpack.NoErrorsPlugin(),
            // new ExtractTextPlugin('style.css', { allChunks: true }),
            new HtmlWebpackPlugin({
                title: 'Watch Me Grow',
                template: path.resolve(__dirname, 'index.ejs'), // Load a custom template (ejs by default but can be changed)
                inject: true
            })
        ],

        // Transform source code using Babel and React Hot Loader
        module: {
            loaders: [
                {test: /\.(json)$/, loader: "json-loader"},
                {test: /\.(svg|md)$/, loader: "raw-loader"},
                {test: /\.(png|woff|woff2|ttf|eot)$/, loader: "url-loader?limit=10000"},
                {test: /\.html$/, loader: "html-loader"}
            ]
        },

        sassLoader: {
            data: '@import "' + path.resolve(__dirname, 'src/components/theme.scss') + '";'
        },

        // Automatically transform files with these extensions
        resolve: {
            root: path.resolve('./src'),
            extensions: ['', '.js', '.jsx', '.css', '.less']
        }
    }, profileConfig, function(objValue, srcValue, key, object, source, stack) {
        if (isArray(objValue) && isArray(srcValue)) {
            return objValue.concat(srcValue);
        }
    });
};
