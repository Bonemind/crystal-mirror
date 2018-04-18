const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const MinifyPlugin = require('babel-minify-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const webpack = require('webpack');

const plugins = [
   new ExtractTextPlugin({
      filename: './bundle.css',
      allChunks: true,
   }),
   new webpack.optimize.ModuleConcatenationPlugin(),
];

const extractSass = new ExtractTextPlugin({
   filename: "./[name].[contenthash].css",
});


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
            test: /\.css$/,
            use: ExtractTextPlugin.extract({
               use: 'css-loader?importLoaders=1',
            }),
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
      devServer: {
         publicPath: '/',
         contentBase: './dist',
         open: false,
         historyApiFallback: true
      },
   };
};
