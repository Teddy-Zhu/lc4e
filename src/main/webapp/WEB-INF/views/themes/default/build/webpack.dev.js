/**
 * Created by teddyzhu on 2016/10/15.
 */
'use strict'

const webpack = require('webpack')
const merge = require('webpack-merge')
const config = require('./webpack.base')
const ProgressBarPlugin  = require('progress-bar-webpack-plugin')

module.exports = merge(config,
    {
        plugins: [
            new ProgressBarPlugin(),
            new webpack.DefinePlugin({'process.env.NODE_ENV': JSON.stringify('development')}),
            new webpack.NoErrorsPlugin(),
            new webpack.optimize.UglifyJsPlugin({ //压缩代码
                sourceMap: false,
                compress: {
                    warnings: false
                }
            })
        ],
        devtool: 'source-map'
    })