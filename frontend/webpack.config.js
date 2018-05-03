'use strict';
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const path = require('path');
const MinifyPlugin = require('babel-minify-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const webpack = require('webpack');

const convert = require('koa-connect');
const history = require('connect-history-api-fallback');
const proxy = require('http-proxy-middleware');
const internalIp = require('internal-ip');

const plugins = [
   new BundleAnalyzerPlugin(),
   new webpack.ProvidePlugin({
      Util: 'exports-loader?Util!bootstrap/js/dist/util',
      $: 'jquery-slim',
      jquery: 'jquery-slim'
   })
];


module.exports = (env) => {
   const isProductionMode = env === 'production';
   if (isProductionMode) {
      plugins.push(new UglifyJsPlugin());
      plugins.push(new MinifyPlugin());
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
            $: "jquery/dist/jquery.slim.min.js",
            jquery: "jquery/dist/jquery.slim.min.js"
         }
      },
      output: {
         filename: 'bundle.js',
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
            test: /\.scss$/,
            use: [{
               loader: "style-loader"
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
