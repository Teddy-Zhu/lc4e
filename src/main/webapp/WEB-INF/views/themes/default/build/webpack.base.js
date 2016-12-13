/**
 * Created by teddyzhu on 2016/10/15.
 */
'use strict'

const path = require('path')
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require("extract-text-webpack-plugin");
var CleanPlugin = require('clean-webpack-plugin');
const postcss =
    [
        require('autoprefixer')
        ({
            browsers: ['last 2 versions', 'ie > 8']
        })
    ]

module.exports =
    {
        node: {
            fs: "empty"
        },
        entry: {
            app: './src/app.js',
            vendors: ['vue', 'vuex', 'vue-resource', 'element-ui']
        },
        output: {
            path: path.join(__dirname, '../../../../../themes/default/dist/'),
            filename: '[name].js',
            publicPath: '/themes/dist/',
            chunkFilename: '/bundle/[name].js'
        },
        resolve: {
            extensions: ['.js', '.vue', '.css', '.json']
        },
        module: {
            loaders: [
                {
                    test: /\.json$/,
                    loaders: ['json-loader']
                },
                {
                    test: /\.vue$/,
                    loaders: ['vue-loader']
                },
                {
                    test: /\.js$/,
                    loaders: ['babel-loader'],
                    exclude: [/node_modules/]
                },
                {
                    test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                    loader: 'url-loader',
                    query: {
                        limit: 10000,
                        name: 'img/[hash:8].[ext]'
                    }
                },
                {
                    test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                    loader: 'url-loader',
                    query: {
                        limit: 10000,
                        name: 'img/[hash:8].[ext]'
                    }
                },
                {
                    test: /\.css$/,
                    loader: ExtractTextPlugin.extract({fallbackLoader: 'style-loader', loader: 'css-loader'})
                }
            ]
        },
        plugins: [
            new webpack.LoaderOptionsPlugin
            ({
                minimize: true,
                options: {
                    babel: {
                        babelrc: false,
                        presets: [
                            ['es2015', {modules: false}], 'stage-2'
                        ],
                        plugins: ["transform-runtime"]
                    },
                    postcss,
                    vue: {
                        postcss
                    },
                    context: '/'
                }
            }),
            new ExtractTextPlugin("[name].css"),
            new webpack.optimize.CommonsChunkPlugin({
                name: "vendors",
                minChunks: 2,
                filename: 'vendors.js'
            }),
            new CleanPlugin(['bundle', 'img'], {
                root: path.join(__dirname, '../../../../../themes/default/dist/'),
                verbose: true,
                dry: false
            })
        ]
    }