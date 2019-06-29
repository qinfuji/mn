import merge from 'webpack-merge';
import defaultConfig from './config.default';

export default merge(defaultConfig, {
  HOST: 'http://127.0.0.1:7001',
});
