'use strict';

const webpack = require('webpack');

module.exports = {
    entry: "./client/app/app",
    output: {
        path: __dirname + '/build',
        filename: "bundle.js"
    },
    module: {
      loaders: [
        {
          test: /\.js$/,
          loaders: ['babel'],
          exclude: /node_modules/
        },
        {
          test: /\.html$/,
          loader: 'raw'
        },
        {
          test: /\.css$/,
          loaders: [
              'style',
              'css'
          ]
        },
        {
            test: /\.(jpe?g|png|gif|svg)$/i,
            loaders: [
                'file?hash=sha512&digest=hex&name=[hash].[ext]',
                'image-webpack?bypassOnDebug&optimizationLevel=7&interlaced=false'
            ]
        }
      ]
    },
    stats: {
        colors: true,
        reasons: true
    },
    debug: true,
    devtool: 'source-map',
    devServer:{
        historyApiFallback: true,
        inline: true,
        contentBase: 'public'
    }
};
