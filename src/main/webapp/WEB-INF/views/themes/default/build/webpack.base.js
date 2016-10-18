/**
 * Created by teddyzhu on 2016/10/15.
 */
'use strict'

const path              = require('path')
const webpack           = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require("extract-text-webpack-plugin");

const postcss =
    [
        require('autoprefixer')
        ({
            browsers: ['last 2 versions', 'ie > 8']
        })
    ]

module.exports =
{
    entry:
    {
        app: './src/app.js'
    },
    output:
    {
        path      : path.join(__dirname, '../../../../../themes/default/dist/'),
        filename  : '[name].js',
        publicPath: '/'
    },
    resolve:
    {
        extensions: ['.js', '.vue', '.css', '.json']
    },
    module:
    {
        loaders:
            [
                {
                    test: /\.vue$/,
                    loaders: ['vue']
                },
                {
                    test: /\.js$/,
                    loaders: ['babel'],
                    exclude: [/node_modules/]
                },
                {
                    test  : /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                    loader: 'url',
                    query :
                    {
                        limit: 10000,
                        name: 'img/[hash:8].[ext]'
                    }
                },
                {
                    test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                    loader: 'url'
                },
                {
                    test: /\.css$/,
                    loader: ExtractTextPlugin.extract({ fallbackLoader: 'style-loader', loader: 'css-loader' })
                },
                {
                    test: /\.sass$/,
                    loader: 'sass-loader'
                }
            ]
    },
    plugins:
        [
            new webpack.LoaderOptionsPlugin
            ({
                options:
                {
                    babel:
                    {
                        babelrc: false,
                        presets:
                            [
                                ['es2015', {modules: false}], 'stage-2'
                            ]
                    },
                    postcss,
                    vue:
                    {
                        postcss
                    },
                    sassLoader:
                    {
                        includePaths: [path.resolve(__dirname)]
                    },
                    context: '/'
                }
            }),
            new ExtractTextPlugin("[name].css")
        ]
}