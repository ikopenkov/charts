/* eslint-env node */
import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import path from 'path';
// import CleanWebpackPlugin from 'clean-webpack-plugin';

const config: webpack.Configuration = {
    mode: 'development',
    entry: {
        main: './src/index.ts',
    },
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: '[name].js',
    },
    module: {
        rules: [
            {
                test: /\.ts/,
                exclude: /node_modules/,
                use: 'babel-loader',
            },
            {
                test: /\.json$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {},
                    },
                ],
                type: 'javascript/auto',
            },
        ],
    },
    resolve: {
        extensions: ['.ts', '.js'],
        alias: {
            src: `${__dirname}/src`,
        },
    },
    devtool: 'source-map',
    plugins: [
        // new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            template: './src/index.html',
        }),
        new webpack.HotModuleReplacementPlugin(),
    ],
    devServer: {
        // contentBase: path.join(__dirname, 'dist'),
        compress: true,
        port: 9000,
        hot: true,
        // open: true,
        historyApiFallback: true,
    },
};

export default config;
