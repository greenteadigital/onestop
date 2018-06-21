const path = require('path')
const webpack = require('webpack')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const UglifyJsPlugin = require("uglifyjs-webpack-plugin")
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin")
const ModernizrWebpackPlugin = require('modernizr-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

const modernizrConfig = {
  "minify": true,
  "options": [
    "setClasses"
  ],
  "feature-detects": [
    "css/gradients",
    "css/flexbox"
  ]
}

/*
 * env: extra args passed in from webpack or webpack-dev-server via `--env.VAR_NAME=VAR_VALUE`
 * argv: various webpack args, including `--mode {development|production}` to capture environment
 */
module.exports = (env, argv) => {

  const webpackMode = argv.mode || 'development'
  const isProd = webpackMode === 'production'

  const basePlugins = [
    new CleanWebpackPlugin(['dist']),             // remove/clean build folder(s) before building
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/), // filter out moment.js locales for bundle minification
    new HtmlWebpackPlugin({
      inject: false,                              // needed for html-webpack-template to work
      title: 'NOAA OneStop',                      // default title for generated HTML doc
      template: require('html-webpack-template'), // provides more than default template (lang, googleAnalytics, etc)
      lang: 'en-US',                              // string identifying your content language
      favicon: '../img/noaa-favicon.ico',          // adds given favicon path to output HTML
      meta: [                                     // inject meta tags
        {
          property: 'dcterms.format',
          content: 'text/html',
        },
        {
          property: 'og:type',
          content: 'website',
        },
      ],
    }),
    new MiniCssExtractPlugin({
      filename: isProd ? '[name].[hash].css' : '[name].css',
      chunkFilename: isProd ? '[id].[hash].css' : '[id].css'
    }),
    new ModernizrWebpackPlugin(modernizrConfig)
  ]

  const devPlugins = [
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new BundleAnalyzerPlugin()
  ]

  const plugins = basePlugins.concat(isProd ? [] : devPlugins)

  const splitChunksOptimization = {
    splitChunks: {
      chunks: 'async',
      minSize: 30000,
      minChunks: 1,
      maxAsyncRequests: 5,
      maxInitialRequests: 3,
      automaticNameDelimiter: '~',
      name: true,
      cacheGroups: {
        vendors: {
          name: 'vendors',
          test: /[\\/]node_modules[\\/]/,
          chunks: 'all',
          priority: -10
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true
        }
      }
    }
  }

  const prodOptimization = {
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        sourceMap: true                         // set to true if you want JS source maps
      }),
      new OptimizeCSSAssetsPlugin({})
    ]
  }

  const optimization = isProd
      ? { ...splitChunksOptimization, ...prodOptimization }
      : splitChunksOptimization

  return {
    context: path.resolve(__dirname, 'src'),
    entry: {
      main: "./index.jsx",
      vendors: "./vendors.js"
    },
    output: {
      filename: '[name]-[hash].bundle.js'
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader"
          },
        },
        {
          test: /\.css$/,
          use: [
            { loader: "style-loader" },
            { loader: "css-loader", options: { url: false } } // url false allows the fonts in fonts.css to be resolved
          ]
        },
        {
          test: /\.ttf$/,
          use: {
            loader: "file-loader",
            options: {
              name: 'fonts/[name].[ext]',
            }
          }
        },
        {
          test: /\.(gif|svg|jpg|png)$/,
          loader: 'file-loader'
        }
      ]
    },
    plugins: plugins,
    optimization: optimization,
    resolve: {
      // tell webpack what directories should be searched when resolving modules
      modules: [
        path.resolve('./node_modules/leaflet/dist', 'root'),  // allows for leaflet map CSS to be resolvable
        'node_modules',                                       // allows packages in node_modules to be resolvable
        path.resolve('./src/common/link')                     // allows importing <Link> as 'Link' for convenience
      ],
      extensions: ['.js', '.jsx'],            // allow imports to resolve without specifying extensions explicitly
      unsafeCache: !isProd,                   // aggressive, but unsafe caching of all modules
      alias: {
        fa: path.resolve(__dirname, 'img/font-awesome/white/svg/')
      }
    },
    devtool:
        isProd ? false : 'cheap-module-eval-source-map',
    devServer:
        isProd ? {} : {
          publicPath: '/onestop/',
          openPage: 'onestop/',
          disableHostCheck: true,
          hot: true,
          proxy: {
            '/onestop/api/*': {
              target: `${env.URL_API_SEARCH}/`,
              secure: false,
            },
          },
        },
  }
}
