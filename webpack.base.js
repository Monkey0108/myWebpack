//首先引入插件
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');
const isDev = process.env === 'development';
const config = require('./public/config')[isDev ? 'dev' : 'build'];
//webpack.config.js
module.exports = {
    entry: {
        index: './src/index.js',
        login: './src/login.js'
    },
    module: {
        rules: [
            {
                test: /\.(le|c)ss$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            hmr: isDev,
                            reloadAll: true,
                        }
                    },
                    'css-loader',
                    {
                        loader: 'postcss-loader',
                        options: {
                            plugins: function () {
                                return [
                                    require('autoprefixer')()
                                ]
                            }
                        }
                    },
                    'less-loader'
                ],
                exclude: /node_modules/
            },
            {
                test: /\.jsx?$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ["@babel/preset-env"],
                        plugins: [
                            [
                                "@babel/plugin-transform-runtime",
                                {
                                    "corejs": 3
                                }
                            ]
                        ]
                    }
                },
                exclude: /node_modules/ //排除 node_modules 目录
            },
            {
                test: /\.(png|jpg|gif|jpeg|webp|svg|eot|ttf|woff|woff2)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 10240, //10K
                            esModule: false,
                            outputPath: 'assets',
                            name: '[name]_[hash:6].[ext]'
                        }
                    }
                ],
                exclude: /node_modules/
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './public/index.html',
            filename: 'index.html', //打包后的文件名
            config: config.template,
            chunks: ['index']
        }),
        new HtmlWebpackPlugin({
            template: './public/login.html',
            filename: 'login.html', //打包后的文件名
            chunks: ['login']
        }),
        //不需要传参数喔，它可以找到 outputPath
        new CleanWebpackPlugin({
            cleanOnceBeforeBuildPatterns: ['**/*', '!dll', '!dll/**'] //不删除dll目录下的文件
        }),
        new CopyWebpackPlugin([
            {
                from: 'public/js/*.js',
                to: path.resolve(__dirname, 'dist', 'js'),
                flatten: true,
            }
            //还可以继续配置其它要拷贝的文件
        ],
            {
                ignore: ['other.js']
            }),
        new MiniCssExtractPlugin({
            filename: 'css/[name].css' //个人习惯将css文件放在单独目录下
        })
    ],
    output: {
        path: path.resolve(__dirname, 'dist'), //必须是绝对路径
        filename: '[name].[hash:6].js',
        publicPath: '/' //通常是CDN地址
    },
    resolve: {
        modules: ['./src/components', 'node_modules'] //从左到右依次查找
    }
}