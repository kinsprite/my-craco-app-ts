const changeOptimizationMinimize =
  minimize =>
  (webpackConfig, { env, paths }) => {
    if (minimize !== undefined) {
      webpackConfig.optimization.minimize = minimize;
    }

    return webpackConfig;
  };

const overrides =
  (...funcArray) =>
  (webpackConfig, { env, paths }) =>
    funcArray.reduce((config, func) => func(config, { env, paths }), webpackConfig);

module.exports = {
  webpack: {
    configure: (webpackConfig, { env, paths }) => {
      return overrides(changeOptimizationMinimize(false))(webpackConfig, { env, paths });
    },
  },
};
