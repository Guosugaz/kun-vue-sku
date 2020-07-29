const path = require("path");
const VueLoaderPlugin = require('vue-loader/lib/plugin'); // vue-loder插件
const { CleanWebpackPlugin } = require('clean-webpack-plugin'); // 每次打包清除dist插件
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

let isPro = process.env.NODE_ENV.replace(/^\s+|\s+$/, "") === "production";

module.exports = {
    devtool: isPro ? "#source-map" : "#eval-source-map",
    entry: isPro ? "./src/lib/index.js" : "./src/main.js",
    output: {
        path: path.resolve(__dirname, "./dist"),
        publicPath: "/dist/",
        filename: "vue-sku.js",
        library: "VueSku",
        libraryTarget: 'umd',
        umdNamedDefine: true
    },
    module: {
        rules: [
            {
                test: /\.(c|le)ss$/,
                use: [
                    'vue-style-loader',
                    'css-loader',
                    'postcss-loader',
                    'less-loader'
                ]
            }, {
                test: /\.vue$/,
                loader: 'vue-loader'
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/
            },
            {
                test: /\.(png|jpg|gif|svg)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: '8192',
                            name: 'imgs/[name].[hash].[ext]',
                            publicPath: './dist/'
                        }
                    }
                ],

            }
        ]
    },
    resolve: {
        extensions: ['.js', '.vue'],
        alias: {
            '@': path.resolve(__dirname, '../src')
        }
    },
    plugins: [
        new CleanWebpackPlugin(),
        new VueLoaderPlugin()
    ],
    devServer: {
        host: 'localhost',
        historyApiFallback: true,
        noInfo: true,
        overlay: true
    }
}

if (isPro) {
    module.exports.plugins.push(new BundleAnalyzerPlugin())
}