
const webpack = require('webpack');
const merge = require('webpack-merge');
const baseWebpackConfig = require('./webpack.base');
const apiMocker = require('mocker-api');
const path = require('path');
//webpack.config.js
module.exports = merge(baseWebpackConfig, {
    mode: "development",
    plugins: [
        new webpack.HotModuleReplacementPlugin()
    ],
    devServer: {
        hot: true,
        port: '3000', //默认是8080
        quiet: false, //默认不启用
        inline: true, //默认开启 inline 模式，如果设置为false,开启 iframe 模式
        stats: "errors-only", //终端仅打印 error
        overlay: false, //默认不启用
        clientLogLevel: "silent", //日志等级
        compress: true, //是否启用 gzip 压缩
        proxy: {
            '/api': {
                target: 'http://localhost:4000',
                pathRewrite: {
                    '/api': ''
                }
            }
        },
        before(app) {
            apiMocker(app, path.resolve('./mock/mocker.js'))
        }
    },
    devtool: 'cheap-module-eval-source-map' //开发环境下使用
})
