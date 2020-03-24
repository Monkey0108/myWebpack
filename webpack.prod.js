//首先引入插件
const OptimizeCssPlugin = require('optimize-css-assets-webpack-plugin');
const merge = require('webpack-merge');
const baseWebpackConfig = require('./webpack.base');
//webpack.config.js
module.exports = merge(baseWebpackConfig, {
    mode: "production",
    plugins: [
        new OptimizeCssPlugin()
    ]
}) 