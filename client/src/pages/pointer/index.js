import React from 'react';
import {connect} from 'dva';
import Marker from '@/components/AMap/Marker';
import Polygon from '@/components/AMap/Polygon';
import Circle from '@/components/AMap/Circle';
import {loadUI} from '@/components/AMap/api';
import Map from '@/components/AMap/Map';
import {Layout, Form, Modal, Select, Button, Input, Icon} from 'antd';
import localData from '../../utils/adcode.json';
import SearchResultList from './searchResultList';
import CreatePointer from './createPoint';
import {getCodeInfo} from '../../utils/adcodeUtils';
import History from '../../core/history';
import {create, submit, detail, remove} from '../../services/pointer';
import {Constant as PointerAddressConstant} from '../../models/pointerAddress';
const {Header, Content, Footer, Sider} = Layout;

const FormItem = Form.Item;
const Option = Select.Option;

function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some((field) => fieldsError[field]);
}

function generateUUID() {
  var d = new Date().getTime();
  if (window.performance && typeof window.performance.now === 'function') {
    d += performance.now(); //use high-precision timer if available
  }
  var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
  return uuid;
}

const RIGHT_VIEW_CREATE = 'createPointer';
const RIGHT_VIEW_POI_LIST = 'poiList';

const MAP_ACTION_CREATE_MARKER = 'createMarker';
const MAP_ACTION_DRAW = 'mapDraw';

const MAP_DRAW_MODE_MARKET = 'marker';
const MAP_DRAW_MODE_POLYLINE = 'polyline';
const MAP_DRAW_MODE_POLYGON = 'polygon';
const MAP_DRAW_MODE_CIRCLE = 'circle';

var CircleOptions = {
  strokeColor: '#F33', //线颜色
  strokeOpacity: 0.05, //线透明度
  strokeWeight: 0.05, //线粗细度
  fillColor: '#ee2200', //填充颜色
  fillOpacity: 0.05, //填充透明度
  bubble: true,
};

const PolygonOptions = {
  strokeWeight: 2,
  strokeOpacity: 0.2,
  fillColor: '#ee2200',
  fillOpacity: 0.1,
  strokeStyle: 'solid',
};

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

@connect(({pointer}) => ({
  pointer,
}))
@Form.create()
class PointManager extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mapCenter: null,
      mapCircles: [],
      mapMarkers: [],
      mapPolygons: [],
      mapZoom: 4,
      mapNeedClear: false,
      mapActionMode: MAP_ACTION_CREATE_MARKER,
      currentPointer: {},
      showSearchBar: true,
    };
  }

  setMapInstance = async (map) => {
    if (!map) return;
    const {currentAdCode = 100000} = this.props;
    this.map = map;
    const {
      match: {params},
    } = this.props;
    if (params.id) {
      //请求机会点数据
      const response = await detail({id: params.id});
      const data = response.data;
      const currentPointer = {
        adCodeInfo: {
          district: data.district,
          districtName: data.districtName,
          cityName: data.cityName,
          city: data.city,
          province: data.province,
          provinceName: data.provinceName,
        },
        lnglat: {lng: data.lng, lat: data.lat},
        fence: data.fence,
        address: data.address,
        name: data.name,
        labels: data.labels,
        type: data.type,
        id: data.id,
        state: data.state,
        version: data.version,
      };
      const state = await this.createPointerMarker({lnglat: {lng: data.lng, lat: data.lat}}, data.state);
      const p = await this.createFencePolygon(currentPointer);
      //创建围栏对象
      this.setState({
        ...this.state,
        ...state,
        currentPointer: {
          ...state.currentPointer,
          ...currentPointer,
          fenceId: p ? p.id : '',
        },
        rightViewMode: RIGHT_VIEW_CREATE,
        mapPolygons: p ? [p] : [],
        showSearchBar: false,
      });
    } else {
      const uis = await loadUI(['ui/geo/DistrictExplorer', 'ui/misc/PositionPicker', 'ui/misc/PointSimplifier']);
      this.DistrictExplorer = uis[0];
      this.PositionPicker = uis[1];
      this.PointSimplifier = uis[2];
      this.districtExplorer = window.districtExplorer = new this.DistrictExplorer({
        eventSupport: true, //打开事件支持
        map: map,
      });
      this.switch2AreaNode(currentAdCode);
    }
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

  provinceChange = (value) => {
    const {form} = this.props;
    form.setFieldsValue({city: null, district: null});
    if (value) {
      this.switch2AreaNode(value);
      this.setState({
        mapCircles: [],
        mapMarkers: [],
        mapPolygons: [],
        rightViewMode: null,
        mapZoom: this.map.getZoom(),
        currentPointer: null,
        mapDrawMode: null,
        mapActionMode: MAP_ACTION_CREATE_MARKER,
      });
    }
  };

  cityChange = (value) => {
    const {form} = this.props;
    form.setFieldsValue({district: null});
    if (value) {
      this.switch2AreaNode(value);
      this.setState({
        mapCircles: [],
        mapMarkers: [],
        mapPolygons: [],
        rightViewMode: null,
        mapZoom: this.map.getZoom(),
        currentPointer: null,
        mapDrawMode: null,
        mapActionMode: MAP_ACTION_CREATE_MARKER,
      });
    }
  };

  districtChange = (value) => {
    if (value) {
      this.switch2AreaNode(value);

      this.setState({
        mapCircles: [],
        mapMarkers: [],
        mapPolygons: [],
        rightViewMode: null,
        mapZoom: this.map.getZoom(),
        currentPointer: null,
        mapDrawMode: null,
        mapActionMode: MAP_ACTION_CREATE_MARKER,
      });
    }
  };

  onSearch = async (e) => {
    e.preventDefault();
    this.keywordSearch({});
  };

  keywordSearch = ({pageIndex = 1, pageSize = 20, ...reset}) => {
    const {form} = this.props;
    if (!this.addressEle) return;
    const address = this.addressEle.input.value;
    const province = form.getFieldValue('province');
    const city = form.getFieldValue('city');
    const district = form.getFieldValue('district');
    const limitAdcode = district || city || province;
    var autoOptions = Object.assign(
      {
        pageSize: pageSize, //查询的分页
        pageIndex: pageIndex,
        extensions: 'all', //返回基本+详细信息
        type:
          '汽车服务|汽车销售|汽车维修|摩托车服务|餐饮服务|购物服务|生活服务|体育休闲服务|医疗保健服务|住宿服务|风景名胜|商务住宅|政府机构及社会团体|科教文化服务|交通设施服务|金融保险服务|公司企业|道路附属设施|地名地址信息|公共设施',
      },
      reset,
    );
    if (limitAdcode) {
      autoOptions.city = limitAdcode;
      autoOptions.citylimit = true;
    }

    var placeSearch = new window.AMap.PlaceSearch(autoOptions);
    return new Promise((resolve, reject) => {
      placeSearch.search(address, (status, result) => {
        if (status === 'error') {
          return reject(result);
        }
        this.setState({
          poiList: result.poiList,
          rightViewMode: RIGHT_VIEW_POI_LIST,
          mapZoom: this.map.getZoom(),
          center: this.map.getCenter(),
          mapDrawMode: null,
          currentPointer: null,
          mapActionMode: MAP_ACTION_CREATE_MARKER,
        });
        return resolve(result);
      });
    });
  };

  onRevokePointer = () => {
    this.setState({
      rightViewMode: null,
      currentPointer: null,
      mapCircles: [],
      mapMarkers: [],
      mapPolygons: [],
      mapActionMode: MAP_ACTION_CREATE_MARKER,
    });
  };

  onSavePointer = async (pointer) => {
    const lnglat = pointer.lnglat.split(',');
    pointer.lng = lnglat[0];
    pointer.lat = lnglat[1];
    pointer.labels = pointer.labels.join(',');
    const response = await create(pointer);
    if (response) {
      History.push('/listPointAddress');
    }
  };

  onSubmitPointer = async (pointer) => {
    const lnglat = pointer.lnglat.split(',');
    pointer.lng = lnglat[0];
    pointer.lat = lnglat[1];
    pointer.labels = pointer.labels.join(',');
    const response = await submit(pointer);
    if (response) {
      History.push('/listPointAddress');
    }
  };

  onBackList = () => {
    History.push('/listPointAddress');
  };

  onDeletePointer = async (pointer) => {
    const response = await remove(pointer);
    if (response) {
      History.push('/listPointAddress');
    }
  };

  renderSearch = () => {
    const {getFieldDecorator, getFieldValue} = this.props.form;
    const province = getFieldValue('province');
    const city = getFieldValue('city');
    const citys = localData.city[province] || [];
    const districts = localData.district[city] || [];
    return (
      <Form layout="inline">
        <Form.Item label="省">
          {getFieldDecorator('province', {
            initialValue: province || 100000,
          })(
            <Select size="small" allowClear placeholder="请选择" style={{width: 100}} onChange={this.provinceChange}>
              {localData.province.map((o) => {
                return (
                  <Option key={o.key} value={o.key}>
                    {o.label}
                  </Option>
                );
              })}
            </Select>,
          )}
        </Form.Item>

        <Form.Item label="市">
          {getFieldDecorator('city', {})(
            <Select size="small" allowClear placeholder="请选择" style={{width: 100}} onChange={this.cityChange}>
              {citys.map((o) => {
                return (
                  <Option key={o.key} value={o.key}>
                    {o.label}
                  </Option>
                );
              })}
            </Select>,
          )}
        </Form.Item>

        <Form.Item label="区县">
          {getFieldDecorator('district', {})(
            <Select size="small" allowClear placeholder="请选择" style={{width: 100}} onChange={this.districtChange}>
              {districts.map((o) => {
                return (
                  <Option key={o.key} value={o.key}>
                    {o.label}
                  </Option>
                );
              })}
            </Select>,
          )}
        </Form.Item>
        <Form.Item label="地址">
          <Input
            size="small"
            ref={(ele) => {
              this.addressEle = ele;
            }}
            onChange={() => {}}
          ></Input>
        </Form.Item>
        <Form.Item>
          <div id="btnbar">
            <Button type="primary" size="small" onClick={this.onSearch}>
              查询
            </Button>
            <Button type="primary" size="small" onClick={this.onBackList}>
              返回列表
            </Button>
          </div>
        </Form.Item>
      </Form>
    );
  };

  onPoiListPageChange = (pageIndex) => {
    this.keywordSearch({pageIndex});
  };

  onPoiListItemSelected = (item) => {
    const location = item.location;
    const center = [location.lng, location.lat];
    const circle1 = {
      id: generateUUID(),
      options: {
        ...CircleOptions,
        center, // 圆心位置
        radius: 20, //半径
      },
    };

    const circle2 = {
      id: generateUUID(),
      options: {
        ...CircleOptions,
        center, // 圆心位置
        radius: 500, //半径
      },
    };

    const circle3 = {
      id: generateUUID(),
      options: {
        ...CircleOptions,
        center, // 圆心位置
        radius: 1500, //半径
      },
    };

    this.map.clearMap();
    const circles = [circle1, circle2, circle3];
    this.setState({
      mapCircles: circles,
      mapCenter: center,
      mapZoom: 15,
      mapDrawMode: null,
      currentPointer: {},
    });
  };

  createPointer = () => {
    this.setState({
      mapActionMode: MAP_ACTION_CREATE_MARKER,
      rightViewMode: RIGHT_VIEW_CREATE,
    });
  };

  onCreatePointerMarkerHandler = async (e) => {
    const state = await this.createPointerMarker({lnglat: e.lnglat});
    this.setState(state);
  };

  createPointerMarker = async (markerData, state) => {
    const lnglat = markerData.lnglat;
    const marker = {
      id: markerData.id || generateUUID(),
      options: {
        type: 'new',
        position: [lnglat.lng, lnglat.lat],
        offset: new window.AMap.Pixel(-13, -30),
        draggable: !state || state === PointerAddressConstant.status.STATUS_WAIT_SUBMIT ? true : false, //如果是已经提交则不能进行修改
        cursor: 'move',
      },
      events: {
        dragend: (dragEvent) => {
          const {target} = dragEvent;
          const _lnglat = target.getPosition();

          const _marker = {
            ...marker,
            options: {...marker.options},
          };
          const _circle = {
            ...circle,
            options: {
              ...circle.options,
            },
          };
          const position = [_lnglat.lng, _lnglat.lat];
          _marker.options.position = position;
          _circle.options.center = position;

          const geocoder = new window.AMap.Geocoder();
          geocoder.getAddress(position, (status, result) => {
            const state = {
              mapMarkers: [_marker],
              mapCircles: [_circle],
              mapZoom: 15,
              mapNeedClear: false,
              mapCenter: position,
              rightViewMode: RIGHT_VIEW_CREATE,
              mapActionMode: null,
              mapDrawMode: null,
            };
            if (status === 'complete' && result.info === 'OK') {
              const adcode = result.regeocode.addressComponent.adcode;
              const adCodeInfo = getCodeInfo(adcode);
              var refAddress = result.regeocode.formattedAddress; //返回地址描述
              this.setState({
                ...this.state,
                ...state,
                currentPointer: {
                  ...(this.state.currentPointer || {}),
                  adCodeInfo,
                  refAddress,
                  lnglat: {lng: _lnglat.lng, lat: _lnglat.lat},
                },
              });
            } else {
              this.setState(state);
            }
          });
        },
      },
    };
    const center = [lnglat.lng, lnglat.lat];
    const circle = {
      id: generateUUID(),
      options: {
        ...CircleOptions,
        center, // 圆心位置
        radius: 1500, //半径
        editable: true,
      },
    };
    this.map.clearMap();
    const geocoder = new window.AMap.Geocoder();
    return new Promise((resolve, inject) => {
      geocoder.getAddress(center, (status, result) => {
        let state = {
          mapMarkers: [marker],
          mapCircles: [circle],
          mapZoom: 15,
          mapCenter: center,
          rightViewMode: RIGHT_VIEW_CREATE,
          mapActionMode: null,
          mapDrawMode: null,
        };
        if (status === 'complete' && result.info === 'OK') {
          const adcode = result.regeocode.addressComponent.adcode;
          const adCodeInfo = getCodeInfo(adcode);
          var refAddress = result.regeocode.formattedAddress; //返回地址描述
          state = {
            ...this.state,
            ...state,
            currentPointer: {adCodeInfo, refAddress, lnglat: {lng: center[0], lat: center[1]}},
          };
        }
        resolve(state);
      });
    });
  };

  onRelocation = (lnglat) => {
    if (lnglat) {
      const m = Math.ceil(Math.random() * 10);
      this.setState({
        mapCenter: [lnglat.lng, lnglat.lat],
        mapDrawMode: null,
      });
    }
  };

  createFencePolygon = (currentPointer) => {
    const id = currentPointer.id || generateUUID();
    const fence = currentPointer.fence;
    if (!fence) return;
    const paths = fence.split(';');
    const pathObject = [];
    paths.forEach((path) => {
      pathObject.push(path.split(','));
    });
    const _polygon = {
      id,
      options: {
        ...PolygonOptions,
        id,
        path: pathObject,
        editable:
          !currentPointer.state || currentPointer.state === PointerAddressConstant.status.STATUS_WAIT_SUBMIT
            ? {
                events: {
                  adjust: (e) => {
                    const pointerAddress = this.state.currentPointer;
                    const path = e.target.getPath();
                    pointerAddress.fence = path.join(';');
                    const pythone = this.createFencePolygon(pointerAddress);
                    this.setState({
                      mapPolygons: pythone ? [pythone] : [],
                      mapActionMode: null,
                      mapDrawMode: false,
                      currentPointer: {
                        ...pointerAddress,
                        fenceId: id,
                      },
                    });
                  },
                },
              }
            : null,
      },
    };
    return _polygon;
  };

  onRemoveCurrentFence = (id) => {
    const {mapPolygons} = this.state;
    if (mapPolygons && mapPolygons.length) {
      const ret = mapPolygons.reduce((ret, polygon) => {
        console.log(id, polygon.id);
        if (polygon.id !== id) {
          ret.push(polygon);
        }
        return ret;
      }, []);
      this.setState({
        mapPolygons: ret,
        mapActionMode: null,
        mapDrawMode: false,
        currentPointer: {
          ...this.state.currentPointer,
          fence: null,
        },
      });
    }
  };

  pointerInfoChange = (values) => {
    this.setState({
      currentPointer: {
        ...this.state.currentPointer,
        ...values,
      },
      mapNeedClear: false,
    });
  };

  //建立围栏
  onCreateFence = () => {
    this.setState({
      mapActionMode: MAP_ACTION_DRAW,
      mapDrawMode: {
        mode: MAP_DRAW_MODE_POLYGON,
        options: {},
        events: [
          (e) => {
            const path = e.obj.getPath();
            const currentPointer = this.state.currentPointer;
            currentPointer.fence = path.join(';');
            const _polygon = this.createFencePolygon(currentPointer);
            e.obj.getMap().remove(e.obj);
            this.setState({
              mapPolygons: [_polygon],
              mapActionMode: null,
              mapDrawMode: false,
              currentPointer: {
                ...currentPointer,
                fenceId: _polygon.id,
              },
            });
          },
        ],
      },
      mapNeedClear: false,
    });
  };

  render() {
    const {
      poiList = [],
      rightViewMode,
      mapCenter, //地图中心
      mapNeedClear, //地图在刷新是是否清除
      mapZoom = 4, //地图缩放比例
      mapCircles, //地图的圆形覆盖物
      mapMarkers, //标记
      mapPolygons, //多边形
      currentPointer, //当前创建的点址数据
      mapDrawMode, //绘图模式开启
      mapActionMode, //开启创建标记时间
      showSearchBar, //是否显示查询框
    } = this.state;
    return (
      <Layout style={{width: '100%', height: '100%'}}>
        {showSearchBar && (
          <Header>
            <div style={{float: 'left'}}>{this.renderSearch()}</div>
          </Header>
        )}
        <Layout style={{width: '100%', height: '100%'}}>
          <Content>
            <Map
              refer={this.setMapInstance}
              style={{width: '100%', height: '100%'}}
              events={{
                click: mapActionMode === MAP_ACTION_CREATE_MARKER ? this.onCreatePointerMarkerHandler : null,
              }}
              options={{
                center: mapCenter,
                drawMode: mapDrawMode,
                zoom: mapZoom,
                clear: mapNeedClear,
              }}
            >
              {mapCircles &&
                mapCircles.length &&
                mapCircles.map((c) => {
                  return <Circle key={c.id} options={c.options} events={c.events} />;
                })}

              {mapMarkers &&
                mapMarkers.length &&
                mapMarkers.map((m) => {
                  return <Marker key={m.id} options={m.options} events={m.events} />;
                })}

              {mapPolygons &&
                mapPolygons.length &&
                mapPolygons.map((p) => {
                  return <Polygon key={p.id} options={p.options} events={p.events} />;
                })}
            </Map>
          </Content>
          <Sider theme="light" width={rightViewMode ? '25%' : '1px'} style={{height: '100%', overflow: 'auto'}}>
            {rightViewMode === RIGHT_VIEW_POI_LIST && (
              <SearchResultList
                poiList={poiList}
                onPageChange={this.onPoiListPageChange}
                onItemSelected={this.onPoiListItemSelected}
              />
            )}
            {rightViewMode === RIGHT_VIEW_CREATE && (
              <CreatePointer
                pointer={currentPointer}
                onRemoveFence={this.onRemoveCurrentFence}
                onCreateFence={this.onCreateFence}
                onRelocation={this.onRelocation}
                onChange={this.pointerInfoChange}
                onRevoke={this.onRevokePointer}
                onSave={this.onSavePointer}
                onDelete={this.onDeletePointer}
                onSubmit={this.onSubmitPointer}
                onBack={this.onBackList}
              />
            )}
          </Sider>
        </Layout>
      </Layout>
    );
  }
}

export default PointManager;
