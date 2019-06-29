import merge from 'webpack-merge';
import defaultConfig from './config.default';

export default merge(defaultConfig, {
  HOST: '',
});
