import * as webpack from 'webpack';
import * as webpackDevServer from 'webpack-dev-server';

interface Configuration extends webpack.Configuration {
  devServer?: webpackDevServer.Configuration;
}

const isProduction = process.env.NODE_ENV === 'production';

const commonConfig: Partial<Configuration> = {
  mode: isProduction ? 'production' : 'development',
  devtool: isProduction ? 'source-map' : 'cheap-source-map',
  resolve: {
    extensions: ['.js', '.ts', '.tsx'],
  },
};

// webpack-dev-serverの設定
const devServerConfig: webpackDevServer.Configuration = {
  contentBase: `${__dirname}/docs`,
  publicPath: '/',
  open: true,
};

const config: Configuration = {
  ...commonConfig,
  devServer: devServerConfig,

  entry: './src/js/index.ts',
  output: {
    path: `${__dirname}/docs`,
    filename: 'main.js',
  },
  module: {
    rules: [
      // TypeScript
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        options: {},
      },
      // CSS
      {
        test: /\.css/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              url: false,
            },
          },
        ],
      },
      // 画像ファイル
      {
        test: /\.png/,
        use: ['url-loader'],
      },
    ],
  },
};

export default [config];
