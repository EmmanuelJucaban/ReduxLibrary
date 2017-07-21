import path from 'path';
import webpack from 'webpack';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import htmlWebpackPlugin from 'html-webpack-plugin';
import cleanWebpackPlugin from 'clean-webpack-plugin';
import optimizeCssAssetsWebpackPlugin from 'optimize-css-assets-webpack-plugin';

var VENDOR_LIBS = [
  "bootstrap", "jquery", "react", "react-dom", "redux", "react-redux"
];

export default (env) => {
  return {
    entry: {
      main: path.resolve(__dirname, '..'),
      vendor: VENDOR_LIBS
    },
    output: {
      path: path.resolve(__dirname, '..', 'build-production'),
      filename: '[name].[chunkhash].bundle.js'
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          loader: 'eslint-loader',
          enforce: 'pre',
          exclude: /node_modules/,
          query: require(path.resolve(__dirname, 'eslint.config.js'))
        },
        {
          test: /\.jsx?/,
          loader: 'babel-loader',
          exclude: /node_modules/
        },
        {
          test: /\.css$/,
          use: ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: 'css-loader?sourceMap'
          })
        },
        {
          test: /\.(png|woff|woff2|eot|ttf|svg)$/,
          loader: 'url-loader',
          options: {
            limit: 100000
          }
        }
      ]
    },
    plugins: [
      new ExtractTextPlugin('[name].[chunkhash].css'),
      new webpack.optimize.CommonsChunkPlugin({
        name: 'vendor',
        filename: 'vendor.[chunkhash].bundle.js',
        chunks: ['vendor']
      }),
      new webpack.ProvidePlugin({
        $: 'jquery',
        jQuery: 'jquery'
      }),
      new cleanWebpackPlugin(['build-production'], {
        root: path.resolve(__dirname, '..'),
        verbose: true
      }),
      new htmlWebpackPlugin({
        template: 'index.html',
        hash: true,
        minify: {
          collapseWhitespace: true
        }
      }),
      new optimizeCssAssetsWebpackPlugin(),
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(env)
      }),
      new webpack.optimize.UglifyJsPlugin({
        output: {
          comments: false,
        },
        mangle: false,
        sourceMap: true
      })
    ],
    resolve: {
      extensions: ['.js', '.css'],
      alias: {
        components: path.resolve(__dirname, '..', 'src/components'),
        styles: path.resolve(__dirname, '..', 'src/styles'),
        reducers: path.resolve(__dirname, '..', 'src/reducers')
      },
    },
    devServer: {
      contentBase: path.resolve(__dirname, '..', "build-production"),
      inline: true,
      port: 3000
    },
    devtool: 'source-map'
  };
};
