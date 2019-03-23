/* eslint-env node */
import webpack from 'webpack';
import merge from 'webpack-merge';
import CleanWebpackPlugin from 'clean-webpack-plugin';
// @ts-ignore
// import MinifyPlugin from 'babel-minify-webpack-plugin';
// @ts-ignore
// import ClosurePlugin from 'closure-webpack-plugin';
import devConfig from './webpack.config';

const config: webpack.Configuration = {
    mode: 'production',
    plugins: [new CleanWebpackPlugin()],
    devtool: false,
    // optimization: {
    // minimizer: [
    // new MinifyPlugin()
    // new ClosurePlugin({ mode: 'AGGRESSIVE_BUNDLE' }, {}),
    // new MinifyPlugin(),
    // new ClosurePlugin({ mode: 'AGGRESSIVE_BUNDLE' }, {}),
    // ],
    // },
};

export default merge(devConfig, config);
