const deepMerge = require('deepmerge');
const { getPlugin, pluginByName } = require('@craco/craco');
const getClientEnvironment = require('react-scripts/config/env');
const rewireTypingsForCssModule = require('react-app-rewire-typings-for-css-module');
const CracoAlias = require('craco-alias');
// const CracoSassResourcesLoader = require('craco-sass-resources-loader');
// const AddAssetPlugin = require('add-asset-webpack-plugin');

const overrideOptimizationMinimize =
  minimize =>
  (webpackConfig, { env, paths }) => {
    if (minimize !== undefined) {
      webpackConfig.optimization.minimize = minimize;
    }

    return webpackConfig;
  };

const overridePluginOptions =
  (pluginName, options) =>
  (webpackConfig, { env, paths }) => {
    const { isFound, match } = getPlugin(webpackConfig, pluginByName(pluginName));

    if (isFound && match.options !== undefined) {
      match.options = deepMerge(match.options, options);
    }

    return webpackConfig;
  };

const overrideTypingsForCssModule =
  () =>
  (webpackConfig, { env, paths }) =>
    rewireTypingsForCssModule(webpackConfig, env);

const overrides =
  (...funcArray) =>
  (webpackConfig, { env, paths }) =>
    funcArray.reduce((config, func) => func(config, { env, paths }), webpackConfig);

module.exports = {
  style: {
    sass: {
      loaderOptions: {
        // Prefer 'sass' (dart-sass) over 'node-sass' if both packages are installed.
        implementation: require('sass'),
        // Workaround for this bug: https://github.com/webpack-contrib/sass-loader/issues/804
        webpackImporter: false,
      },
    },
  },
  webpack: {
    configure: (webpackConfig, { env, paths }) => {
      return overrides(
        overrideOptimizationMinimize(undefined),
        overridePluginOptions('HtmlWebpackPlugin', {
          templateParameters: getClientEnvironment().raw,
        }),
        overrideTypingsForCssModule(),
      )(webpackConfig, { env, paths });
    },
  },
  plugins: [
    {
      plugin: CracoAlias,
      options: {
        source: 'options',
        baseUrl: './',
        aliases: {
          '@': './src',
        },
      },
    },
  ],
};
