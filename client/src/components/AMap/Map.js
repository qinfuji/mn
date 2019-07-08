import React, {Component, PureComponent} from 'react';
import PropTypes from 'prop-types';
import {createMap, updateMap} from './api';

const __com__ = 'Map';
//const debug = console.log;
const debug = () => {};

export class Map extends Component {
  static propTypes = {
    refer: PropTypes.func, // 类似ref的函数形式,可以让父组件调用_entity
    options: PropTypes.object,
    events: PropTypes.object,
    //   zoom: PropTypes.number, // 10, //设置地图显示的缩放级别
    //   center: PropTypes.array, // [116.397428, 39.90923]，//设置地图中心点坐标
    //   layers: PropTypes.array, // [new AMap.TileLayer.Satellite()],  //设置图层,可设置成包含一个或多个图层的数组
    //   mapStyle: PropTypes.string, // 'amap://styles/whitesmoke',  //设置地图的显示样式
    //   viewMode: PropTypes.string, // '2D',  //设置地图模式
    //   lang: PropTypes.string, // 'zh_cn',  //设置地图语言类型
    //   events: PropTypes.object, // {'click': function}, // 事件map
  };
  constructor() {
    super();
    this.refElement = null;
    this._entity = null;
    debug(__com__, 'component constructor', this._entity);
  }

  componentWillMount() {
    debug(
      __com__,
      'componentWillMount',
      this._entity,
      'layerCount:' + (this._entity && this._entity.getLayers().length),
    );
  }

  componentDidMount() {
    debug(
      __com__,
      'componentDidMount',
      this._entity,
      'layerCount:' + (this._entity && this._entity.getLayers().length),
    );
    let {options, events} = this.props;
    this._entity = createMap(this.refElement, options, events);
    if (this._entity) {
      if (this.props.refer) this.props.refer(this._entity);
      this.setState({__map__: this._entity});
    }
  }

  componentWillReceiveProps(nextProps) {
    debug(
      __com__,
      'componentWillReceiveProps',
      this._entity,
      'layerCount:' + (this._entity && this._entity.getLayers().length),
    );
  }

  componentWillUpdate() {
    debug(
      __com__,
      'componentWillUpdate',
      this._entity,
      'layerCount:' + (this._entity && this._entity.getLayers().length),
    );
  }

  componentDidUpdate(prevProps) {
    debug(
      __com__,
      'componentDidUpdate',
      this._entity,
      'layerCount:' + (this._entity && this._entity.getLayers().length),
    );
    let {options, events} = this.props;
    if (!this._entity) {
      this._entity = createMap(this.refElement, options, events);
      if (this._entity) {
        if (this.props.refer) this.props.refer(this._entity);
        this.setState({__map__: this._entity});
      }
      return;
    }
    // need check props changes, then update.
    //updateMap(this._entity, this.props, prevProps);
    updateMap(this._entity, options, events, prevProps.options, prevProps.events);
  }

  componentWillUnmount() {
    debug(
      __com__,
      'componentWillUnmount',
      this._entity,
      'layerCount:' + (this._entity && this._entity.getLayers().length),
    );
    if (this._entity) {
      this._entity.destroy();
      //   delete this._entity;
      this._entity = null;
      if (this.props.refer)
        this.props.refer(this._entity, 'layerCount:' + (this._entity && this._entity.getLayers().length));
    }
  }

  renderChildren(children, __map__) {
    return React.Children.map(children, (child) => {
      if (child) {
        const cType = child.type;
        /* 针对下面两种组件不注入地图相关属性
         * 1. 明确声明不需要注入的
         * 2. DOM 元素
         */
        if (cType.preventAmap || typeof cType === 'string') {
          debug(__com__, 'component renderChildren orig');
          return child;
        }
        debug(__com__, 'component renderChildren add __map__');
        return React.cloneElement(child, {
          __map__,
        });
      }
      debug(__com__, 'component renderChildren null');
      return child;
    });
  }

  render() {
    debug(__com__, 'render', this._entity, 'layerCount:' + (this._entity && this._entity.getLayers().length));
    let {className, style, children} = this.props;
    let restProps = {};
    if (className) restProps = {...restProps, className};
    if (style) restProps = {...restProps, style};

    return (
      <div
        ref={(ele) => {
          this.refElement = ele;
        }}
        {...restProps}
      >
        {this.renderChildren(children, this._entity)}
      </div>
    );
  }
}

export default Map;
