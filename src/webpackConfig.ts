export default `
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const friendlyErrorPlugin = require('friendly-errors-webpack-plugin')

const port = 8888;
module.exports = {
  mode: 'development',
  entry: {
    webcomp: [
      \`webpack-dev-server/client?http://127.0.0.1:\${port}/sockjs-node\`,
      'webpack/hot/dev-server',
      './apps/webcomp/index.ts'
    ]
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    publicPath: '/',
    // https://github.com/webpack/webpack/issues/6642
    globalObject: 'this'
  },
  devServer: {
    clientLogLevel: 'warning',
    historyApiFallback: {
      disableDotRule: true,
      rewrites: [{ from: /.*/, to: path.posix.join('/', 'index.html') }]
    },
    hot: true,
    contentBase: path.resolve(__dirname, 'public'),
    watchContentBase: true, 
    compress: false,
    host: 'localhost',
    port,
    open: false,
    overlay: { warnings: false, errors: true }, 
    publicPath: '/',
    progress: true,
    proxy: {},
    quiet: true,
    watchOptions: {
      poll: false
    }
  },
  resolve: {
    extensions: ['.js', '.ts', '.json']
  },
  module: {
    rules: [
      {
        test: /\\.ts$/,
        loader: 'ts-loader'
      },
      {
        test:/\\.css/,
        loader: path.resolve(__dirname, 'loader.js')
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"development"',
        BASE_URL: '"/"'
      }
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.ProgressPlugin(),
    new HtmlWebpackPlugin({
      template: 'public/index.html',
      inject: true
    }),
    new friendlyErrorPlugin()
  ]
};
`;