/* eslint-env node */
import webpack from 'webpack';
import merge from 'webpack-merge';
// import TerserPlugin from 'terser-webpack-plugin';
import baseConfig from './webpack.config';

const config: webpack.Configuration = {
    mode: 'development',
    devtool: 'source-map',
    plugins: [new webpack.HotModuleReplacementPlugin()],
    devServer: {
        // contentBase: path.join(__dirname, 'dist'),
        compress: true,
        port: 9000,
        hot: true,
        // open: true,
        historyApiFallback: true,
    },
};

export default merge(baseConfig, config);
