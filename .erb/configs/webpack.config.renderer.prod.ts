/**
 * Build config for electron renderer process
 */

import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
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

  target: 'electron-renderer',

  externals: {
    'yargs': 'commonjs yargs', // Exclude yargs from the bundle
    'puppeteer-core': 'commonjs puppeteer-core', // Exclude puppeteer-core
  },

  entry: [path.join(webpackPaths.srcRendererPath, 'index.tsx')],

  output: {
    path: webpackPaths.distRendererPath,
    publicPath: './',
    filename: 'renderer.js',
  },

  module: {
    noParse: /yargs|puppeteer-core/,
    rules: [
      {
        test: /\.s?(a|c)ss$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              modules: true,
              sourceMap: true,
              importLoaders: 1,
            },
          },
          'sass-loader',
        ],
        include: /\.module\.s?(c|a)ss$/,
      },
      {
        test: /\.s?(a|c)ss$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
        exclude: /\.module\.s?(c|a)ss$/,
      },
      // Fonts
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
      },
      // Images
      {
        test: /\.(png|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      },
      // SVG
      {
        test: /\.svg$/,
        use: [
          {
            loader: '@svgr/webpack',
            options: {
              prettier: false,
              svgo: false,
              svgoConfig: {
                plugins: [{ removeViewBox: false }],
              },
              titleProp: true,
              ref: true,
            },
          },
          'file-loader',
        ],
      },
    ],
  },

  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin(), new CssMinimizerPlugin()],
  },

  plugins: [
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
    }),

    new MiniCssExtractPlugin({
      filename: 'style.css',
    }),

    new BundleAnalyzerPlugin({
      analyzerMode: process.env.ANALYZE === 'true' ? 'server' : 'disabled',
      analyzerPort: 8889,
    }),

    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: path.join(webpackPaths.srcRendererPath, 'index.ejs'),
      minify: {
        collapseWhitespace: true,
        removeAttributeQuotes: true,
        removeComments: true,
      },
      isBrowser: false,
      isDevelopment: false,
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

    new webpack.DefinePlugin({
      'process.type': '"renderer"',
    }),
  ],
};

export default merge(baseConfig, configuration);
