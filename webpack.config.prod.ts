/* eslint-env node */
import webpack from 'webpack';
import merge from 'webpack-merge';
import CleanWebpackPlugin from 'clean-webpack-plugin';
// import TerserPlugin from 'terser-webpack-plugin';
import devConfig from './webpack.config';

const config: webpack.Configuration = {
    mode: 'production',
    plugins: [new CleanWebpackPlugin()],
    devtool: 'source-map',
    // optimization: {
    //     minimizer: [
    //         new TerserPlugin({
    //             terserOptions: {
    //                 // mangle: {
    //                 //     properties: true,
    //                 // },
    //                 // sourceMap: true,
    //                 // ecma: 6,
    //                 // module: true,
    //                 // compress: {
    //                 //     passes: 6,
    //                 // },
    //             },
    //         }),
    //     ],
    // },
};

export default merge(devConfig, config);
