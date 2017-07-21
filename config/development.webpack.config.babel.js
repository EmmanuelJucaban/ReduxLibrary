import path from 'path';
import webpack from 'webpack';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import htmlWebpackPlugin from 'html-webpack-plugin';
import cleanWebpackPlugin from 'clean-webpack-plugin';

var VENDOR_LIBS = [
  "bootstrap", "jquery", "react", "react-dom"
];



export default (env) => {
  return {
    entry: {
      main: path.resolve(__dirname, '..'),
      vendor: VENDOR_LIBS
    },
    output: {
      path: path.resolve(__dirname, '..', 'build-development'),
      filename: '[name].bundle.js'
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
            use: 'css-loader'
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
      new ExtractTextPlugin('[name].css'),
      new webpack.optimize.CommonsChunkPlugin({
        name: 'vendor',
        filename: 'vendor.bundle.js',
        chunks: ['vendor']
      }),
      new webpack.ProvidePlugin({
        $: 'jquery',
        jQuery: 'jquery'
      }),
      new cleanWebpackPlugin(['build-development'], {
        root: path.resolve(__dirname, '..'),
        verbose: true
      }),
      new htmlWebpackPlugin({
        template: 'index.html'
      })
    ],
    resolve: {
      extensions: ['.js', '.css'],
      alias: {
        components: path.resolve(__dirname, '..', 'src/components'),
        styles: path.resolve(__dirname, '..', 'src/styles'),
        reducers: path.resolve(__dirname, '..', 'src/reducers')
      }
    },
    devServer: {
      contentBase: path.resolve(__dirname, '..', "build-development"),
      inline: true,
      port: 3000
    },
    devtool: 'eval-source-map'
  };
};
