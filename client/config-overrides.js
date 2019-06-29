const {
  override,
  fixBabelImports,
  addLessLoader,
  addDecoratorsLegacy,
  addWebpackAlias,
  overrideDevServer,
} = require('customize-cra');
const MockMiddleware = require('./dev-middlewares/MockMiddleware');
const path = require('path');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const addCustomize = () => (config) => {
  if (process.env.NODE_ENV === 'production') {
    config.devtool = false; //去掉map文件
    if (config.plugins) {
      config.plugins.push(new BundleAnalyzerPlugin());
    }
    const splitChunksConfig = config.optimization.splitChunks;
    if (config.entry && config.entry instanceof Array) {
      config.entry = {
        main: config.entry,
        vendor: [
          'react',
          'react-dom',
          'react-router-dom',
          'react-redux',
          'redux',
          'lodash',
          'moment',
          'react-intl',
          'redux-promise-middleware',
          'react-router',
        ],
      };
    } else if (config.entry && typeof config.entry === 'object') {
      config.entry.vendor = [
        'react',
        'react-dom',
        'react-router-dom',
        'react-redux',
        'redux',
        'lodash',
        'moment',
        'react-intl',
        'redux-promise-middleware',
        'react-router',
      ];
    }

    Object.assign(splitChunksConfig, {
      chunks: 'all',
      cacheGroups: {
        vendors: {
          test: /node_modules/,
          name: 'vendors',
          priority: -10,
        },
        common: {
          name: 'common',
          minChunks: 2,
          minSize: 30000,
          chunks: 'all',
        },
      },
    });
  }
  return config;
};

const devServerConfig = () => (config) => {
  return {
    ...config,
    proxy: {
      context: () => true,
    },
    before: function(app, server) {
      console.log(app, server);
      app.use(MockMiddleware());
    },
  };
};

module.exports = {
  webpack: override(
    fixBabelImports('lodash', {
      libraryDirectory: '',
      camel2DashComponentName: false,
    }),
    fixBabelImports('import', {
      libraryName: 'antd',
      libraryDirectory: 'es',
      //style: 'css',
      style: true,
    }),

    addLessLoader({
      javascriptEnabled: true,
      modifyVars: {'@primary-color': '#1DA57A'},
    }),

    addLessLoader({
      modifyvars: {
        '@icon-url': `${path.resolve(__dirname, 'build/assets/font/iconfont')}`, //使用本地字体文件
        '@font-size-base': '13px',
        '@primary-color': '#00879C',
      },
      javascriptEnabled: true,
    }),
    addWebpackAlias({
      '@': path.resolve(__dirname, 'src'),
      '@config': process.env.REACT_APP_MOCK
        ? path.resolve(__dirname, 'src/config/config.mock.js')
        : process.env.NODE_ENV === 'production'
        ? path.resolve(__dirname, 'src/config/config.prod.js')
        : path.resolve(__dirname, 'src/config/config.dev.js'),
      '@/components': path.resolve(__dirname, 'src/components'),
    }),
    addDecoratorsLegacy(),
    addCustomize(),
  ),

  devServer: overrideDevServer(devServerConfig()),
};
