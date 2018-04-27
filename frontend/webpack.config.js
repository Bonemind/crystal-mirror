'use strict';
const path = require('path');
const MinifyPlugin = require('babel-minify-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const webpack = require('webpack');

const convert = require('koa-connect');
const history = require('connect-history-api-fallback');
const proxy = require('http-proxy-middleware');

module.exports = (env) => {
   if (env === 'production') {
      plugins.push(new UglifyJsPlugin());
      plugins.push(new MinifyPlugin());
   }

   return {
      entry: [
         'babel-polyfill',
         './src/index.js',
      ],
      mode: env,
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
      serve: {
         mode: 'development',
         content: [__dirname] + '/dist',
         host: '192.168.1.7',
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
   };
};
