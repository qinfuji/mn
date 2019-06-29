import {Component} from 'react';

export default (dvaApp) => {
  return class DvaContainer extends Component {
    render() {
      dvaApp.router(() => this.props.children);
      return dvaApp.start()();
    }
  };
};
