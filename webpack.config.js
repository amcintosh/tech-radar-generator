'use strict'

const path = require('path')

const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const postcssPresetEnv = require('postcss-preset-env')
const cssnano = require('cssnano')

const r = f => path.resolve(__dirname, f)

const main = [r('src/site.js')]
const common = [r('./src/common.js')]
let devtool

const plugins = [
  new CleanWebpackPlugin(),
  new MiniCssExtractPlugin({ filename: '[name].[hash].css' }),
  new HtmlWebpackPlugin({
    template: r('./src/index.html'),
    chunks: ['main'],
    inject: 'body'
  }),
  new HtmlWebpackPlugin({
    template: r('./src/error.html'),
    chunks: ['common'],
    inject: 'body',
    filename: 'error.html'
  })
]

module.exports = {
  context: process.cwd(),

  entry: {
    main,
    common
  },

  resolve: {
    fallback: {
      fs: false
    }

  },

  output: {
    // Output path is set in main.js
    filename: '[name].[hash].js'
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        include: r('./src'),
        use: [{ loader: require.resolve('babel-loader') }]
      },
      {
        test: /\.scss$/,
        include: r('./src'),
        use: [
          require.resolve('style-loader'),
          MiniCssExtractPlugin.loader, {
            loader: require.resolve('css-loader'),
            options: { importLoaders: 1 }
          },
          {
            loader: require.resolve('postcss-loader'),
            options: {
              postcssOptions: {
                plugins: [
                  postcssPresetEnv({ browsers: 'last 2 versions' }),
                  cssnano({ preset: ['default', { discardComments: { removeAll: true } }] })
                ]
              }
            }
          },
          {
            loader: 'resolve-url-loader'
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true
            }
          }
        ]
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2)$/,
        loader: require.resolve('file-loader'),
        options: {
          name: 'images/[name].[ext]'
        }
      },
      {
        test: /\.(png|jpg|ico)$/,
        include: r('./src'),
        use: [{
          loader: require.resolve('file-loader'),
          options: {
            name: 'images/[name].[ext]',
            context: r('./src/images')
          }
        }]
      },
      {
        test: require.resolve('jquery'),
        loader: 'expose-loader',
        options: {
          exposes: ['$', 'jQuery']
        }
      },
      {
        test: r('./src/data'),
        use: {
          loader: require.resolve('val-loader'),
          options: {
            // This is only used by webpack-dev-server, and is overridden in index.js
            data: require('./example-data.json')
          }
        }
      }
    ]
  },

  plugins,

  devtool,

  devServer: {
    host: '0.0.0.0',
    port: 8080
  }
}
