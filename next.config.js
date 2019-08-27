const withSass = require("@zeit/next-sass");
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");

module.exports = withSass({
  cssModules: true,
  webpack: (config, options) => {
    if (config.resolve.plugins) {
      config.resolve.plugins(new TsconfigPathsPlugin());
    } else {
      config.resolve.plugins = [new TsconfigPathsPlugin()];
    }

    // config.module.rules.push({
    //   test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/,
    //   use: {
    //     loader: "url-loader",
    //     options: {
    //       limit: 100000
    //     }
    //   }
    // });

    return config;
  }
});
