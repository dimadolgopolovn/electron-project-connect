import path from 'path';
import webpack from 'webpack';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import { merge } from 'webpack-merge';
import checkNodeEnv from '../scripts/check-node-env';
import baseConfig from './webpack.config.base';
import webpackPaths from './webpack.paths';

// When an ESLint server is running, we can't set the NODE_ENV so we'll check if it's
// at the dev webpack config is not accidentally run in a production environment
if (process.env.NODE_ENV === 'production') {
  checkNodeEnv('development');
}

const configuration: webpack.Configuration = {
  devtool: 'inline-source-map',

  mode: 'development',

  target: 'electron-preload',

  entry: path.join(webpackPaths.srcMainPath, 'preload.ts'),

  output: {
    path: webpackPaths.dllPath,
    filename: 'preload.js',
    library: {
      type: 'umd',
    },
  },

  plugins: [
    new BundleAnalyzerPlugin({
      analyzerMode: process.env.ANALYZE === 'true' ? 'server' : 'disabled',
    }),

    /**
     * Create global constants which can be configured at compile time.
     *
     * Useful for allowing different behaviour between development builds and
     * release builds
     *
     * NODE_ENV should be production so that modules do not perform certain
     * development checks
     *
     * By default, use 'development' as NODE_ENV. This can be overriden with
     * 'staging', for example, by changing the ENV variables in the npm scripts
     */
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'development',
    }),

    new webpack.LoaderOptionsPlugin({
      debug: true,
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

  watch: true,
};

export default merge(baseConfig, configuration);
