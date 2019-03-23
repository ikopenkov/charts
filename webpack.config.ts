/* eslint-env node */
import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import path from 'path';

const config: webpack.Configuration = {
    entry: {
        main: './src/index.ts',
    },
    output: {
        path: path.resolve(__dirname, './docs'),
        filename: '[name].[hash].js',
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
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html',
        }),
    ],
};

export default config;
