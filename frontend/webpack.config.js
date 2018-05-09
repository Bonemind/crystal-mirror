'use strict';
// Utility
const glob = require("glob-all");
const path = require('path');
const convert = require('koa-connect');
const history = require('connect-history-api-fallback');
const proxy = require('http-proxy-middleware');
const internalIp = require('internal-ip');
const webpack = require('webpack');

// Plugins
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const MinifyPlugin = require('babel-minify-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const PurifyCSSPlugin = require("purifycss-webpack");
const MiniCssExtractPlugin  = require('mini-css-extract-plugin');
const HtmlWebpackPlugin  = require('html-webpack-plugin');


module.exports = (env) => {
   const isProductionMode = env === 'production';

   // Base plugins needed for all modes
   const plugins = [
      new webpack.ProvidePlugin({
         Util: 'exports-loader?Util!bootstrap/js/dist/util',
         $: 'jquery-slim',
         jquery: 'jquery-slim'
      }),
      new HtmlWebpackPlugin({
         title: 'Crystal mirror'
      }),
      new PurifyCSSPlugin({
         paths: glob.sync([
            path.join(__dirname, "src/**/*.js")
         ]),
         purifyOptions: {
            // Should be iziToast, not oast, but due to:
            // https://github.com/purifycss/purifycss/issues/145
            // We can only use part of the name
            whitelist: ['*oast*', '*modal*']
         },
         minimize: isProductionMode
      }),
   ];

   if (isProductionMode) {
      plugins.push(new UglifyJsPlugin());
      plugins.push(new MinifyPlugin());
      plugins.push(new MiniCssExtractPlugin({
         filename: '[name].[hash].css',
         chunkFilename: '[id].[hash].css'
      }));
   } else {
      plugins.push(new BundleAnalyzerPlugin({
         analyzerHost: '0.0.0.0',
         openAnalyzer: false,
      }));
      plugins.push(new MiniCssExtractPlugin({
         filename: '[name].css',
         chunkFilename: '[id].css'
      }));
   }

   const base = {
      entry: [
         'babel-polyfill',
         'font-awesome-webpack!./font-awesome.config.js',
         './src/index.js',
      ],
      mode: env,
      resolve: {
         alias: {
            jquery: "jquery/dist/jquery.slim.js"
         }
      },
      output: {
         filename: 'bundle.js',
         publicPath: '/',
         path: path.resolve(__dirname, './dist'),
      },
      module: {
         rules: [{
            test: /\.js$/,
            loader: 'babel-loader',
            include: [
               path.resolve(__dirname, './'),
            ],
         }, {
            test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
            loader: "url-loader?limit=10000&mimetype=application/font-woff"
         }, {
            test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
            loader: "file-loader"
         }, {
            test: /\.s?[ac]ss$/,
            use: [{
               loader: (true || isProductionMode) ? MiniCssExtractPlugin.loader : "style-loader"
            }, {
               loader: "css-loader"
            }, {
               loader: "sass-loader"
            }
            ],
         }]
      },
      plugins,
   };

   // Dev proxy server
   if (env !== 'production') {
      const serve = {
         mode: 'development',
         content: [__dirname] + '/dist',
         host: internalIp.v4.sync(),
         add: (app, middleware, options) => {
            app.use(convert(proxy('/api', {
               target: 'http://localhost:3200',

               pathRewrite: {
                  '^/api': '/'
               }
            })));
            app.use(convert(history()));
         }
      }
      base['serve'] = serve;
   }
   return base;
};
