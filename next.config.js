const withCSS = require("@zeit/next-css");
const withSass = require("@zeit/next-sass");
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");

module.exports = withSass(
  withCSS({
    cssModules: true,
    webpack: (config, options) => {
      if (config.resolve.plugins) {
        config.resolve.plugins(new TsconfigPathsPlugin());
      } else {
        config.resolve.plugins = [new TsconfigPathsPlugin()];
      }

      config.module.rules.forEach(rule => {
        if (
          rule.test.toString().includes(".scss") ||
          rule.test.toString().includes(".css")
        ) {
          rule.rules = rule.use.map(useRule => {
            if (typeof useRule === "string") {
              return { loader: useRule };
            }

            if (useRule.loader.startsWith("css-loader")) {
              return {
                oneOf: [
                  {
                    test: new RegExp(".module.scss$"),
                    loader: useRule.loader,
                    options: useRule.options
                  },
                  {
                    loader: useRule.loader,
                    options: {}
                  }
                ]
              };
            }
            return useRule;
          });
          delete rule.use;
        }
      });

      return config;
    }
  })
);
