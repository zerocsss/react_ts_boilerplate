/**
 * TODO: 区分环境 —— NODE_ENV
 * - whenDev ☞ process.env.NODE_ENV === 'development'
 * - whenTest ☞ process.env.NODE_ENV === 'test'
 * - whenProd ☞ process.env.NODE_ENV === 'production'
 */
const { when, whenDev, whenProd, whenTest, ESLINT_MODES, POSTCSS_MODES } = require('@craco/craco')
const WebpackBar = require('webpackbar'); // webpack构建进度条
const CracoAntDesignPlugin = require("craco-antd");
const CracoLessPlugin = require("craco-less");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer"); // 打包依赖分析
const WebpackDayjsPlugin = require('antd-dayjs-webpack-plugin'); // moment to dayjs
// const SimpleProgressWebpackPlugin = require('simple-progress-webpack-plugin'); 增加了打包时间原因未知
const TerserPlugin = require('terser-webpack-plugin')
const CompressionWebpackPlugin = require('compression-webpack-plugin')

const path = require('path');

const pathResolve = pathUrl => path.join(__dirname, pathUrl)
module.exports = {
  webpack: {
    alias: {
      '@': pathResolve('.'),
      src: pathResolve('src'),
      assets: pathResolve('src/assets'),
      components: pathResolve('src/components'),
      pages: pathResolve('src/pages'),
      store: pathResolve('src/store'),
      utils: pathResolve('src/utils')
    },
    plugins: [
      new WebpackBar({ profile: true }),
      new BundleAnalyzerPlugin(),
      new WebpackDayjsPlugin(),
      ...whenProd(
        () => [
          // new TerserPlugin({
          //   // sourceMap: true, // Must be set to true if using source-maps in production
          //   terserOptions: {
          //     ecma: undefined,
          //     parse: {},
          //     compress: {
          //       warnings: false,
          //       drop_console: true, // 生产环境下移除控制台所有的内容
          //       drop_debugger: true, // 移除断点
          //       pure_funcs: ['console.log'] // 生产环境下移除console
          //     }
          //   }
          // }),
          // 打压缩包
          // new CompressionWebpackPlugin({
          //   algorithm: 'gzip',
          //   test: new RegExp('\\.(' + ['js', 'css'].join('|') + ')$'),
          //   threshold: 1024,
          //   minRatio: 0.8
          // })
        ],
        []
      )
    ],
    optimization: {
      splitChunks: {
        cacheGroups: {
          commons: {
            chunks: 'initial',
            minChunks: 2,
            maxInitialRequests: 5,
            minSize: 0
          },
          vendor: {
            test: /node_modules/,
            chunks: 'initial',
            name: 'vendor',
            priority: 10,
            enforce: true
          }
        }
      }
    },
  },
  plugins: [
    {
      plugin: CracoAntDesignPlugin,
      options: {
        customizeTheme: {
          '@primary-color': 'red',
          "@link-color": "red",
        },
        babelPluginImportOptions: {
          // libraryName: 'antd',
          libraryDirectory: "es",
          style: true,
        },
      },
    },
    // {
    //   plugin: CracoLessPlugin,
    //   options: {
    //     lessLoaderOptions: {
    //       lessOptions: {
    //         modifyVars: {
    //           "@primary-color": "#1DA57A",
    //           "@link-color": "#1DA57A",
    //           "@border-radius-base": "2px"
    //         },
    //         javascriptEnabled: true
    //       }
    //     }
    //   }
    // }
  ],
};