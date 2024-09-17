/**
 * Base webpack config used across other specific configs
 */

import TsconfigPathsPlugins from 'tsconfig-paths-webpack-plugin';
import webpack from 'webpack';
import { dependencies as externals } from '../../release/app/package.json';
import webpackPaths from './webpack.paths';

const configuration: webpack.Configuration = {
  externals: [...Object.keys(externals || {})],

  stats: 'errors-only',

  module: {
    noParse: /yargs|puppeteer-core/,
    rules: [
      {
        test: /\.[jt]sx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'ts-loader',
          options: {
            transpileOnly: true,
            compilerOptions: {
              module: 'esnext',
            },
          },
        },
      },
    ],
  },

  output: {
    path: webpackPaths.srcPath,
    library: {
      type: 'commonjs2',
    },
  },

  resolve: {
    extensions: ['.js', '.jsx', '.json', '.ts', '.tsx'],
    modules: [webpackPaths.srcPath, 'node_modules'],
    plugins: [new TsconfigPathsPlugins()],
  },

  plugins: [
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'production',
    }),

    // Handle dynamic requires for yargs
    new webpack.IgnorePlugin({
      resourceRegExp: /^yargs$/,
    }),
    new webpack.ContextReplacementPlugin(
      /yargs[\/\\]/,
      (context) => {
        // Remove critical dependencies or handle them differently
        delete context.dependencies;
        return context;
      }
    ),

    new webpack.ContextReplacementPlugin(/yargs\/(build|parser)/, (data) => {
      delete data.dependencies[0].critical; // Suppress critical warnings
      return data;
    }),

    // NormalModuleReplacementPlugin to handle dynamic requires in yargs
    new webpack.NormalModuleReplacementPlugin(/yargs/, (resource) => {
      if (/build\/index\.cjs$/.test(resource.request)) {
        // Replace dynamic requires with an empty or static module
        resource.request = './build/static.js';
      }
    }),

    // Handle dynamic requires for fluent-ffmpeg
    new webpack.ContextReplacementPlugin(
      /fluent-ffmpeg\/lib\/options/,
      (data) => {
        delete data.dependencies[0].critical; // Suppress critical warnings
        return data;
      },
    ),

    // Ignore lib-cov folder for fluent-ffmpeg
    new webpack.IgnorePlugin({
      resourceRegExp: /lib-cov\/fluent-ffmpeg/,
    }),
  ],
};

export default configuration;
