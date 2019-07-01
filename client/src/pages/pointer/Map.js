import React from 'react';

import {loadMap, loadPlugin, loadAmpLocaApi, loadAmpUIApi, loadUI} from '@/components/AMap/api';
import Map from '@/components/AMap/Map';

var colors = [
  '#3366cc',
  '#dc3912',
  '#ff9900',
  '#109618',
  '#990099',
  '#0099c6',
  '#dd4477',
  '#66aa00',
  '#b82e2e',
  '#316395',
  '#994499',
  '#22aa99',
  '#aaaa11',
  '#6633cc',
  '#e67300',
  '#8b0707',
  '#651067',
  '#329262',
  '#5574a6',
  '#3b3eac',
];

class Amap extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      initedMap: false,
    };
  }

  componentDidMount() {
    setTimeout(async () => {
      await loadMap(); //加载地图API
      console.log(window.AMap.Scale);
      // this.scale = new window.AMap.Scale({
      //   visible: true,
      // });
      await loadAmpUIApi(); //加载UI api
      const uis = await loadUI(['ui/geo/DistrictExplorer', 'ui/misc/PositionPicker', 'ui/misc/PointSimplifier']);
      this.DistrictExplorer = uis[0];
      this.PositionPicker = uis[1];
      this.PointSimplifier = uis[2];
      await loadPlugin([
        'AMap.PlaceSearch',
        'AMap.Geolocation',
        'AMap.Scale',
        'AMap.ToolBar',
        'AMap.Geocoder',
        'AMap.MouseTool',
      ]);
      await loadAmpLocaApi(); //加载loca api
      this.setState({initedMap: true});
    });
  }

  setMapInstance = (map) => {
    const {currentAdCode = 100000} = this.props;
    this.map = map;
    this.districtExplorer = window.districtExplorer = new this.DistrictExplorer({
      eventSupport: true, //打开事件支持
      map: map,
    });
    //map.addControl(this.scale);
    this.switch2AreaNode(currentAdCode);
  };

  renderAreaPolygons = (areaNode) => {
    //更新地图视野
    this.map.setBounds(areaNode.getBounds(), null, null, true);
    //清除已有的绘制内容
    this.districtExplorer.clearFeaturePolygons();
    //绘制子区域
    this.districtExplorer.renderSubFeatures(areaNode, (feature, i) => {
      var fillColor = colors[i % colors.length];
      var strokeColor = colors[colors.length - 1 - (i % colors.length)];
      return {
        cursor: 'default',
        bubble: true,
        strokeColor: strokeColor, //线颜色
        strokeOpacity: 1, //线透明度
        strokeWeight: 1, //线宽
        fillColor: fillColor, //填充色
        fillOpacity: 0.35, //填充透明度
      };
    });

    //绘制父区域
    this.districtExplorer.renderParentFeature(areaNode, {
      cursor: 'default',
      bubble: true,
      strokeColor: 'black', //线颜色
      strokeOpacity: 1, //线透明度
      strokeWeight: 1, //线宽
      fillColor: areaNode.getSubFeatures().length ? null : colors[0], //填充色
      fillOpacity: 0.35, //填充透明度
    });
  };

  loadAreaNode = (adcode, callback) => {
    this.districtExplorer.loadAreaNode(adcode, (error, areaNode) => {
      if (error) {
        if (callback) {
          callback(error);
        }
        console.error(error);
        return;
      }
      if (callback) {
        callback(null, areaNode);
      }
    });
  };

  refreshAreaNode = (areaNode) => {
    this.districtExplorer.setHoverFeature(null);
    this.renderAreaPolygons(areaNode);
  };

  componentWillReceiveProps = (nextProps) => {
    if (nextProps.clean) {
      this.map.clearMap();
    }

    this.switch2AreaNode(nextProps.currentAdcode);
  };

  switch2AreaNode = (adcode, callback) => {
    if (this.currentAreaNode && '' + this.currentAreaNode.getAdcode() === '' + adcode) {
      return;
    }
    this.loadAreaNode(adcode, (error, areaNode) => {
      if (error) {
        if (callback) {
          callback(error);
        }
        return;
      }
      this.currentAreaNode = areaNode;
      //设置当前使用的定位用节点
      this.districtExplorer.setAreaNodesForLocating([this.currentAreaNode]);
      this.refreshAreaNode(areaNode);
      if (callback) {
        callback(null, areaNode);
      }
    });
  };

  render() {
    const {initedMap} = this.state;
    const {zoom, center} = this.props;
    return (
      initedMap && (
        <Map
          refer={this.setMapInstance}
          style={{width: '100%', height: '100%'}}
          options={{
            zoom: zoom,
            center: center,
            mapStyle: 'amap://styles/ab2c0d8d125f8d8556e453149622a5a2',
          }}
          events={{}}
        >
          {this.props.children}
        </Map>
      )
    );
  }
}

export default Amap;
