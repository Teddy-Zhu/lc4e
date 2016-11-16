/**
 * Created by teddyzhu on 2016/10/15.
 */
'use strict'

const webpack = require('webpack')
const merge = require('webpack-merge')
const config = require('./webpack.base')

module.exports = merge(config,
    {
        output: {
            publicPath: '/'
        },
        plugins: [
            new webpack.DefinePlugin({'process.env.NODE_ENV': JSON.stringify('development')}),
            new webpack.NoErrorsPlugin()
            // ,
            // new webpack.optimize.UglifyJsPlugin({ //压缩代码
            //     compress: {
            //         warnings: true
            //     }
            // })
        ],
        devtool: 'source-map'
    })