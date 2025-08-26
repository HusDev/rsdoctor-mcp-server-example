import { defineConfig } from '@rspack/cli';
import { rspack } from '@rspack/core';
import { ReactRefreshRspackPlugin } from '@rspack/plugin-react-refresh';
import { RsdoctorRspackPlugin } from '@rsdoctor/rspack-plugin';

const isDev = process.env.NODE_ENV === 'development';
const isProd = process.env.NODE_ENV === 'production';

// Target browsers, see: https://github.com/browserslist/browserslist
const targets = ['last 2 versions', '> 0.2%', 'not dead', 'Firefox ESR'];

export default defineConfig({
  mode: isProd ? 'production' : 'development',
  devtool: isDev ? 'eval-cheap-module-source-map' : 'source-map',
  devServer: {
    proxy: [
      {
        context: ['/api'],
        target: 'http://localhost:4000',
        changeOrigin: true,
      },
    ],
    compress: true,
    historyApiFallback: true,
    hot: true,
  },
  entry: {
    main: './src/main.tsx',
  },
  output: {
    filename: isProd ? '[name].[contenthash:8].js' : '[name].js',
    chunkFilename: isProd ? '[name].[contenthash:8].js' : '[name].js',
    assetModuleFilename: 'assets/[name].[contenthash:8][ext]',
    clean: true,
  },
  resolve: {
    extensions: ['...', '.ts', '.tsx', '.jsx'],
    alias: {
      '@': './src',
    },
  },
  module: {
    rules: [
      {
        test: /\.svg$/,
        type: 'asset',
      },
      {
        test: /\.(png|jpe?g|gif|webp|avif)$/i,
        type: 'asset/resource',
        generator: {
          filename: isProd
            ? 'assets/images/[name].[contenthash:8][ext]'
            : 'assets/images/[name][ext]',
        },
      },
      {
        test: /\.(jsx?|tsx?)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'builtin:swc-loader',
            options: {
              jsc: {
                parser: {
                  syntax: 'typescript',
                  tsx: true,
                },
                transform: {
                  react: {
                    runtime: 'automatic',
                    development: isDev,
                    refresh: isDev,
                  },
                },
              },
              env: {
                targets,
              },
              minify: isProd,
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new rspack.HtmlRspackPlugin({
      template: './index.html',
    }),
    process.env.RSDOCTOR &&
      new RsdoctorRspackPlugin({ supports: { generateTileGraph: true } }),
    isDev ? new ReactRefreshRspackPlugin() : null,
  ].filter(Boolean),
  optimization: {
    minimize: isProd,
    sideEffects: false,
    splitChunks: {
      chunks: 'all',
      minSize: 20000,
      maxSize: 150000,
      cacheGroups: {
        react: {
          test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
          name: 'vendor.react',
          chunks: 'initial',
          priority: 20,
          enforce: true,
        },
        tanstack: {
          test: /[\\/]node_modules[\\/]@tanstack[\\/]/,
          name: 'vendor.tanstack',
          chunks: 'async',
          priority: 15,
        },
        dayjs: {
          test: /[\\/]node_modules[\\/]dayjs[\\/]/,
          name: 'vendor.dayjs',
          chunks: 'initial',
          priority: 10,
        },
        asyncVendors: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendor.async',
          chunks: 'async',
          priority: 5,
          minChunks: 1,
        },
        defaultVendors: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendor.others',
          chunks: 'initial',
          priority: 1,
          minChunks: 1,
        },
      },
    },
    minimizer: [
      new rspack.SwcJsMinimizerRspackPlugin(),
      new rspack.LightningCssMinimizerRspackPlugin({
        minimizerOptions: { targets },
      }),
    ],
  },
  experiments: {
    css: true,
  },
  performance: {
    hints: isProd ? 'warning' : false,
    maxAssetSize: 250000, // 250KB
    maxEntrypointSize: 400000, // 400KB
  },
});
