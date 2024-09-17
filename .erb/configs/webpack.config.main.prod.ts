/**
 * Webpack config for production electron main process
 */

import path from 'path';
import TerserPlugin from 'terser-webpack-plugin';
import webpack from 'webpack';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import { merge } from 'webpack-merge';
import checkNodeEnv from '../scripts/check-node-env';
import deleteSourceMaps from '../scripts/delete-source-maps';
import baseConfig from './webpack.config.base';
import webpackPaths from './webpack.paths';

checkNodeEnv('production');
deleteSourceMaps();

const configuration: webpack.Configuration = {
  devtool: 'source-map',

  mode: 'production',

  target: 'electron-main',

  entry: {
    main: path.join(webpackPaths.srcMainPath, 'main.ts'),
  },

  output: {
    path: webpackPaths.distMainPath,
    filename: '[name].js',
    library: {
      type: 'umd',
    },
  },

  optimization: {
    minimizer: [
      new TerserPlugin({
        parallel: true,
      }),
    ],
  },

  plugins: [
    new BundleAnalyzerPlugin({
      analyzerMode: process.env.ANALYZE === 'true' ? 'server' : 'disabled',
      analyzerPort: 8888,
    }),

    /**
     * Create global constants which can be configured at compile time.
     *
     * Useful for allowing different behaviour between development builds and
     * release builds
     *
     * NODE_ENV should be production so that modules do not perform certain
     * development checks
     */
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'production',
      DEBUG_PROD: false,
      START_MINIMIZED: false,
    }),

    new webpack.DefinePlugin({
      'process.type': '"browser"',
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

  /**
   * Disables webpack processing of __dirname and __filename.
   * If you run the bundle in node.js it falls back to these values of node.js.
   * https://github.com/webpack/webpack/issues/2010
   */
  node: {
    __dirname: false,
    __filename: false,
  },
  externals: {
    'yargs': 'commonjs yargs', // Exclude yargs from the bundle
    'puppeteer-core': 'commonjs puppeteer-core', // Exclude puppeteer-core
  },
};

export default merge(baseConfig, configuration);
