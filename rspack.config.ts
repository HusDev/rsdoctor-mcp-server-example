import { defineConfig } from '@rspack/cli';
import { rspack } from '@rspack/core';
import { ReactRefreshRspackPlugin } from '@rspack/plugin-react-refresh';
import { RsdoctorRspackPlugin } from '@rsdoctor/rspack-plugin';

const isDev = process.env.NODE_ENV === 'development';

// Target browsers, see: https://github.com/browserslist/browserslist
const targets = ['last 2 versions', '> 0.2%', 'not dead', 'Firefox ESR'];

export default defineConfig({
  devServer: {
    proxy: [
      {
        context: ['/api'],
        target: 'http://localhost:4000',
      },
    ],
  },
  entry: {
    main: './src/main.tsx',
  },
  resolve: {
    extensions: ['...', '.ts', '.tsx', '.jsx'],
  },
  module: {
    rules: [
      {
        test: /\.svg$/,
        type: 'asset',
      },
      {
        test: /\.(png|jpe?g|gif|webp)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.(jsx?|tsx?)$/,
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
              env: { targets },
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
        },
        defaultVendors: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendor.others',
          chunks: 'initial',
          priority: 1,
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
});
