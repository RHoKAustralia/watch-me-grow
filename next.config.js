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

    return config;
  }
});
