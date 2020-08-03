const path = require("path");
const VueLoaderPlugin = require('vue-loader/lib/plugin'); // vue-loder插件
const { CleanWebpackPlugin } = require('clean-webpack-plugin'); // 每次打包清除dist插件
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const HtmlWebpackPlugin = require('html-webpack-plugin'); // html自动生成插件

const ENV = process.env.NODE_ENV.replace(/^\s+|\s+$/, "");

const isPro = ENV === "production";
const isEXp = ENV === "examples";
let output = {
    path: path.resolve(__dirname, "./dist")
};

if (isPro) {
    output = {
        filename: "vue-sku.js",
        library: "VueSku",
        libraryTarget: 'umd',
        umdNamedDefine: true
    }
} else if (isEXp) {
    output = {
        path: path.resolve(__dirname, "./examples"),
        publicPath: "/kun-vue-sku/"
    }
}


module.exports = {
    devtool: isPro || isEXp ? "#source-map" : "#eval-source-map",
    entry: isPro ? "./src/lib/index.js" : "./src/main.js",
    output,
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
    // externals,
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
} else if (isEXp) {
    module.exports.plugins.push(new HtmlWebpackPlugin({
        filename: "index.exp.html",
        template: path.resolve(__dirname, "./index.html")
    }));
}