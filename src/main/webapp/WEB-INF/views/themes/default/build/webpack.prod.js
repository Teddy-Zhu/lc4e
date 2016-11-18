/**
 * Created by teddyzhu on 2016/10/15.
 */
'use strict'

const webpack            = require('webpack')
const ExtractTextPlugin  = require('extract-text-webpack-plugin')
const ProgressBarPlugin  = require('progress-bar-webpack-plugin')
const merge              = require('webpack-merge')
const config             = require('./webpack.base')
const pkg                = require('../package')

module.exports = merge(config,
    {
        output:
        {
            filename: '[name].js'
        },
        entry:
        {
            vendor: Object.keys(pkg.dependencies).filter(name =>
            {
                // update the code if you want to
                // remove some dependencies you don't need in the vendor bundle
                return true
            })
        },
        plugins:
            [
                new ProgressBarPlugin(),
                new ExtractTextPlugin('styles.css'),
                new webpack.DefinePlugin
                ({
                    'process.env.NODE_ENV': JSON.stringify('production')
                }),
                new webpack.LoaderOptionsPlugin
                ({
                    minimize: true
                }),
                // extract vendor chunks
                new webpack.optimize.CommonsChunkPlugin
                ({
                    name    : 'vendor',
                    filename: 'vendor.js'
                }),

                new webpack.LoaderOptionsPlugin
                ({
                    vue:
                    {
                        loaders:
                        {
                            css: ExtractTextPlugin.extract
                            ({
                                loader        : 'css-loader',
                                fallbackLoader: 'vue-style-loader'
                            })
                        }
                    }
                })
            ]
    })