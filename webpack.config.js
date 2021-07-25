/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const webpack = require('webpack');
const CopyPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const { BaseHrefWebpackPlugin } = require('base-href-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = (env, argv) => {
  const basename = !argv.mode ? __dirname.replace('/var/www', '') + '/dist' : ''; // The root of Apache must be /var/www
  return {
    entry: {
      main: path.join(__dirname, 'src/index.tsx'),
    },
    output: {
      path: path.resolve(__dirname, 'dist'),
      publicPath: `${basename}/`,
      filename: '[hash].js',
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [
                '@babel/preset-env',
                '@babel/react',
                {
                  plugins: ['@babel/plugin-proposal-class-properties'],
                },
              ],
            },
          },
        },
        {
          test: /\.html$/,
          use: [
            {
              loader: 'html-loader',
            },
          ],
        },
        {
          test: /\.module\.(scss|sass)$/,
          use: [
            'style-loader',
            {
              loader: 'css-loader',
              options: {
                modules: true,
                importLoaders: 1,
              },
            },
            'postcss-loader',
          ],
        },
        {
          test: /\.css$/,
          use: [MiniCssExtractPlugin.loader, 'css-loader'],
        },
        {
          test: /\.s[ac]ss$/i,
          exclude: /\.module.(s(a|c)ss)$/,
          use: [
            // Creates `style` nodes from JS strings
            'style-loader',
            // Translates CSS into CommonJS
            'css-loader',
            // Compiles Sass to CSS
            'sass-loader',
          ],
        },
        {
          test: /\.s(a|c)ss$/,
          exclude: /\.module.(s(a|c)ss)$/,
          loader: [
            MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
            },
            {
              loader: 'sass-loader',
            },
          ],
        },
        {
          test: /\.tsx?$/,
          loader: 'babel-loader!ts-loader',
          exclude: /node_modules/,
        },
        {
          test: /\.(eot|ttf|otf|svg|png|jpg|gif|woff|woff2)$/,
          use: {
            loader: 'url-loader',
            options: {
              limit: 100000,
              name: '[name].[ext]',
            },
          },
        },
      ],
    },
    plugins: [
      ...(!argv.mode || argv.mode === 'production' ? [new CleanWebpackPlugin()] : []),
      new HtmlWebpackPlugin({ template: './src/index.html' }),
      // new BaseHrefWebpackPlugin({ baseHref: basename }),
      new webpack.DefinePlugin({
        process: {
          env: {
            BASENAME: JSON.stringify(basename),
            APP_PUBLIC_URL: JSON.stringify(basename),
            // IS_LOCAL: true
          },
        },
      }),
      new webpack.ProvidePlugin({
        $: 'jquery',
        jQuery: 'jquery',
      }),
      new CopyPlugin([
        {
          from: 'public/*.json',
          flatten: true,
        },
        {
          from: 'public/*.ico',
          flatten: true,
        },
        {
          from: 'public/img/',
          to: 'img/',
        },
      ]),
      new MiniCssExtractPlugin({
        filename: '[hash].css',
        chunkFilename: '[hash].css',
      }),
    ],
    devServer: {
      host: 'localhost',
      port: 3000,
      historyApiFallback: true,
      disableHostCheck: true,
      /* proxy: {
        "/rest/**": {
          target: "http://localhost:8080",
        },
      }, */
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js'],
      // eslint-disable-next-line no-path-concat
      modules: [path.resolve(__dirname + '/src'), path.resolve(__dirname + '/node_modules')],
    },
    /* optimization: {
      minimize: true,
      minimizer: [
        new TerserPlugin({  // This plugin makes slow the process of WebPack compilation / recompilation.
          cache: false,
          terserOptions: {
            // No rename components names
            keep_classnames: true,
            keep_fnames: true,
          },
        }),
      ],
    }, */
  };
};
