import React, {Component, PureComponent} from 'react';
import PropTypes from 'prop-types';
import {createCircle, updateCircle} from './api';
const __com__ = 'Circle';
const debug = console.log;
//const debug = () => {};

export class Circle extends Component {
  static propTypes = {
    __map__: PropTypes.object,
    options: PropTypes.object,
    events: PropTypes.object,
  };

  constructor() {
    super();
    this.refElement = null;
    this._entity = null;
  }

  componentDidMount() {
    debug(__com__, 'componentDidMount', this.props.children, this._entity);
    let {__map__, options, events, children} = this.props;
    let opts = {...(options || {}), map: __map__};
    this._entity = createCircle(opts, events);
    if (this._entity) {
      if (this.props.refer) this.props.refer(this._entity);
    }
  }

  componentDidUpdate(prevProps) {
    debug(__com__, 'componentDidUpdate', this.props.children, this._entity);
    let {__map__, options, events, children} = this.props;
    let opts = {...(options || {}), map: __map__};
    if (!this._entity) {
      this._entity = createCircle(opts, events);
      if (this._entity) {
        if (this.props.refer) this.props.refer(this._entity);
      }
      return;
    }

    // need check props changes, then update.
    let oldOpts = {
      ...(prevProps.options || {}),
      map: prevProps.__map__,
    };
    updateCircle(this._entity, opts, events, oldOpts, prevProps.events);
  }

  componentWillUnmount() {
    debug(__com__, 'componentWillMount', this.props.children, this._entity);
    if (this._entity) {
      this._entity.setMap(null);
      this._entity = null;
      if (this.props.refer) this.props.refer(this._entity);
    }
  }

  render() {
    return null;
  }
}

export default Circle;
