const path = require('path');
const { DefinePlugin } = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const outputDirectory = 'dist';

module.exports = env => ({
  entry: ['babel-polyfill', './src/client/index.js'],
  output: {
    path: path.resolve(__dirname, outputDirectory),
    filename: '[name].bundle.js',
    chunkFilename: '[name].bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: ['file-loader']
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: ['file-loader']
      }
    ]
  },
  resolve: {
    extensions: ['*', '.js', '.jsx'],
    alias: {
      Apis: path.resolve(__dirname, 'src/client/apis/'),
      Components: path.resolve(__dirname, 'src/client/components/'),
      Context: path.resolve(__dirname, 'src/client/context/'),
      Hooks: path.resolve(__dirname, 'src/client/hooks/'),
      Pages: path.resolve(__dirname, 'src/client/pages/'),
      Services: path.resolve(__dirname, 'src/client/services/'),
      Utils: path.resolve(__dirname, 'src/client/utils')
    }
  },
  devServer: {
    contentBase: path.resolve(__dirname, outputDirectory),
    port: 3000,
    open: true,
    proxy: {
      '/': 'http://localhost:8888'
    }
  },
  devtool: 'source-map',
  optimization: {
    splitChunks: {
      chunks: 'all'
    }
  },
  plugins: [
    new DefinePlugin({ 'process.env.SCOPE': JSON.stringify(env.SCOPE) }),
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: './public/index.html',
      favicon: './public/favicon.ico'
    })
  ]
});
