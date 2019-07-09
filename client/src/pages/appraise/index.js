import React from 'react';
import {
  Layout,
  Form,
  Modal,
  Select,
  Button,
  Input,
  DatePicker,
  Tooltip,
  Switch,
  Slider,
  Icon,
  Card,
  Row,
  Col,
} from 'antd';
import Marker from '@/components/AMap/Marker';
import Polygon from '@/components/AMap/Polygon';
import Circle from '@/components/AMap/Circle';
import InfoWindow from '@/components/AMap/InfoWindow';
import History from '../../core/history';
import Map from '@/components/AMap/Map';
import {getEsmtimateByPointerAddressId} from '../../services/appraise';
import {fetch as fetchPointerAddress} from '../../services/pointer';
import {PolygonOptions, CircleOptions} from '../../utils/mapShapeOptions';
import {Constant as PointerAddressConstant} from '../../models/pointerAddress';
import {generateUUID} from '../../utils/misc';
const {Content, Sider} = Layout;
const {RangePicker} = DatePicker;
const {Option} = Select;

function getPath(sPath) {
  if (!sPath) return [];
  const pointers = sPath.split(';');
  if (pointers.length >= 3) {
    const path = [];
    pointers.forEach((pointer) => {
      path.push(pointer.split(','));
    });
    return path;
  } else {
    return [];
  }
}

@Form.create()
class Appraise extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mapCenter: null,
      mapCircles: [],
      mapMarkers: [],
      mapPolygons: [],
      mapZoom: 4,
      mapNeedClear: false,
      mapDrawMode: false,
      mapWindowInfo: null,
      currentAppraise: {
        distance: 1.5, //默认辐射范围1.5公里
      },
      currentPointerAddress: {},
      competitors: [], //竞品店
      userHotFencePolygons: [], //热力围栏
    };
  }

  setMapInstance = async (map) => {
    if (!map) return;
    this.map = map;
    this.map.addControl(new window.AMap.Scale());
    const {
      match: {params},
    } = this.props;
    const pointerAddressId = params.pointerAddressId;
    //得到点址，评估数据
    const response = await getEsmtimateByPointerAddressId({pointerAddressId});

    const otherPointerAddress = await this.getFilterPointerAddress();
    const data = response.data;
    const pointerAddress = data.pointerAddress;
    const appraise = data.appraise;
    const markers = [];
    const polygons = [];
    const circles = [];

    //查询范围内的竞品店
    const competitors = await this.getRemoteCompetitor({
      adcode: pointerAddress.district,
      scope: 'district',
      type: PointerAddressConstant.type.TYPPE_COMPETITION_SHOP,
      lng: pointerAddress.lng,
      lat: pointerAddress.lat,
      distance: appraise ? appraise.distance : 1000, //默认辐射范围1000米
    });

    //绘制marker,
    //如果有围栏，绘制围栏信息
    const center = [pointerAddress.lng, pointerAddress.lat];
    const pointerAddressMarker = {
      id: pointerAddress.id,
      options: {
        position: center,
        offset: new window.AMap.Pixel(-13, -30),
      },
    };
    markers.push(pointerAddressMarker);
    if (pointerAddress.fence) {
      //如果有围栏信息，需要画出围栏信息
      const pointers = getPath(pointerAddress.fence);
      if (pointers.length >= 3) {
        const _polygon = {
          id: pointerAddress.id,
          options: {
            ...PolygonOptions,
            path: pointers,
          },
        };
        polygons.push(_polygon);
      }
    }

    let distance = 1000;
    if (appraise && appraise.distance) {
      distance = appraise.distance;
    }
    const _circle = {
      id: pointerAddress.id,
      options: {
        ...CircleOptions,
        center, // 圆心位置
        radius: distance, //半径
      },
    };

    circles.push(_circle);

    this.setState({
      mapZoom: 15,
      mapCenter: center,
      mapMarkers: markers,
      mapCircles: circles,
      mapPolygons: polygons,
      currentPointerAddress: pointerAddress,
      competitors,
    });
  };

  tranCompetitorKeyValue = (pointerAddress) => {
    if (!pointerAddress || !pointerAddress.length) {
      return [];
    }
    const ret = [];
    pointerAddress.forEach((p) => {
      ret.push({
        key: p.id,
        value: p.name,
      });
    });
    return ret;
  };

  /**
   * 得到条件过滤后的点址数据
   * @param filterLabels 业态标签
   * @param competitorIds 竞品id
   * @param distance 辐射范围
   */
  getFilterPointerAddress = async ({filterLabels, competitorIds, distance} = {}) => {};

  /**
   * 获取竞品列表数据
   */
  getRemoteCompetitor = async ({distance, adcode, scope, lng, lat, type} = {}) => {
    const response = await fetchPointerAddress({
      pageSize: 500,
      pageIndex: 1,
      lng,
      lat,
      scope,
      adcode,
      type,
      distance,
    });
    if (response) {
      return response.data.records;
    }
    return [];
  };

  /**
   * 得到标签
   */
  getCategroyLabels = async () => {};

  /**
   * 获取测控点列表
   */
  getObserverIds = async () => {};

  distanceChange = async (value) => {
    const {form} = this.props;
    const params = form.getFieldsValue(['filterLabels', 'competitorIds']);
    const {mapCircles, currentPointerAddress} = this.state;
    const circles = [];
    if (mapCircles && mapCircles.length) {
      for (let i = 0; i < mapCircles.length; i++) {
        if (mapCircles[i].id === currentPointerAddress.id) {
          const temp = {
            id: currentPointerAddress.id,
            options: {
              ...mapCircles[i].options,
              radius: value,
            },
          };
          circles.push(temp);
        } else {
          circles.push(mapCircles[i]);
        }
      }
    }
    const competitors = await this.getRemoteCompetitor({
      adcode: currentPointerAddress.district,
      scope: 'district',
      type: PointerAddressConstant.type.TYPPE_COMPETITION_SHOP,
      lng: currentPointerAddress.lng,
      lat: currentPointerAddress.lat,
      distance: value,
    });
    this.setState({
      mapCircles: circles,
      competitors,
    });
  };

  competitorIdsChange = (competitorIds) => {
    const {competitors, currentPointerAddress} = this.state;
    const polygons = [];
    if (competitorIds && competitorIds.length && competitors && competitors.length) {
      competitorIds.forEach((competitorId) => {
        for (let i = 0; i < competitors.length; i++) {
          const competitor = competitors[i];
          if (competitor.id === competitorId) {
            if (!competitor.fence) continue;
            const pointers = getPath(competitor.fence);
            if (pointers.length >= 3) {
              const _polygon = {
                id: competitorId,
                options: {
                  ...PolygonOptions,
                  path: pointers,
                  title: competitor.name,
                },
                events: {
                  click: (e) => {
                    this.openCreateInfoWindiw(e.lnglat, competitor);
                  },
                },
              };
              polygons.push(_polygon);
            }
          }
        }
      });
    }
    const pointers = getPath(currentPointerAddress.fence);
    if (pointers.length >= 3) {
      const _polygon = {
        id: currentPointerAddress.id,
        options: {
          ...PolygonOptions,
          path: pointers,
        },
      };
      polygons.push(_polygon);
    }
    console.log(polygons);
    this.setState({
      mapPolygons: polygons,
    });
  };

  openCreateInfoWindiw = (lnglat, pointerAddress) => {
    console.log(lnglat, pointerAddress);
    //构建信息窗体中显示的内容
    var info = [];
    info.push(`<div style="padding:0px 0px 0px 4px;"><b>名称:${pointerAddress.name}</b>`);
    info.push(`地址 :${pointerAddress.address}</div></div>`);
    this.setState({
      mapWindowInfo: {
        options: {
          content: info.join('<br/>'),
          opened: true,
          position: lnglat,
          closeWhenClickMap: true,
        },
        events: {
          open: () => {},
          close: () => {
            this.setState({
              mapWindowInfo: null,
            });
          },
        },
      },
    });
  };

  onCreateUserFenceHandle = () => {
    this.setState({
      mapNeedClear: true,
      mapDrawMode: {
        mode: 'polygon',
        options: {},
        events: [
          (e) => {
            const pathobj = e.obj.getPath();
            const pathArray = getPath(pathobj.join(';'));
            const polygon = this.createUserHotFencePolygon(pathArray);
            e.obj.getMap().remove(e.obj);
            const polygons = [].concat(this.state.userHotFencePolygons, polygon);
            this.setState({
              userHotFencePolygons: polygons,
            });
          },
        ],
      },
    });
  };

  createUserHotFencePolygon = (paths) => {
    const id = generateUUID();
    const _polygon = {
      id,
      options: {
        ...PolygonOptions,
        id,
        path: paths,
        editable: {
          events: {
            adjust: (e) => {
              //   const pointerAddress = this.state.currentPointer;
              //   const path = e.target.getPath();
              //   pointerAddress.fence = path.join(';');
              //   const pythone = this.createFencePolygon(pointerAddress);
              //   this.setState({
              //     mapPolygons: pythone ? [pythone] : [],
              //     mapActionMode: null,
              //     mapDrawMode: false,
              //     currentPointer: {
              //       ...pointerAddress,
              //       fenceId: id,
              //     },
              //   });
            },
          },
        },
      },
    };
    return _polygon;
  };

  onRemoveUserHotFence = (userHotFance) => {
    const {userHotFencePolygons = []} = this.state;
    const ret = [];
    userHotFencePolygons.forEach((polygon) => {
      if (polygon.id === userHotFance.id) {
        return;
      }
      ret.push(polygon);
    });
    this.setState({
      userHotFencePolygons: ret,
    });
  };

  goBackList = () => {
    History.push('/listPointAddress');
  };

  createMarker = () => {};

  render() {
    const {
      mapCenter, //地图中心
      mapNeedClear, //地图在刷新是是否清除
      mapZoom = 4, //地图缩放比例
      mapCircles, //地图的圆形覆盖物
      mapMarkers, //标记
      mapPolygons, //多边形
      currentAppraise, //当前创建的点址数据
      currentPointerAddress,
      mapDrawMode, //绘图模式开启
      competitors, //精品店
      mapWindowInfo,
      userHotFencePolygons, //用户自定义热力围栏
    } = this.state;
    const {
      form: {getFieldDecorator},
    } = this.props;

    return (
      <Layout style={{width: '100%', height: '100%'}}>
        <Content>
          <Map
            refer={this.setMapInstance}
            style={{width: '100%', height: '100%'}}
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

            {userHotFencePolygons &&
              userHotFencePolygons.length &&
              userHotFencePolygons.map((p) => {
                return <Polygon key={p.id} options={p.options} events={p.events} />;
              })}

            {mapWindowInfo && (
              <InfoWindow key={mapWindowInfo.id} options={mapWindowInfo.options} events={mapWindowInfo.events} />
            )}
          </Map>
        </Content>
        <Sider theme="light" width={'25%'} style={{height: '100%', overflow: 'auto'}}>
          <div className="pointerCreate">
            <Form onSubmit={this.onSubmit}>
              <Form.Item label="评估点" labelCol={{span: 4}} wrapperCol={{span: 15}}>
                {currentPointerAddress.name}
              </Form.Item>
              <Form.Item label="业态标签">
                {getFieldDecorator('filterLabels', {})(
                  <Select mode="multiple">
                    <Option value={1}>标签1</Option>
                    <Option value={2}>标签2</Option>
                  </Select>,
                )}
              </Form.Item>
              <Form.Item label="竞对呈现">
                {getFieldDecorator('competitorIds', {
                  initialValue:
                    currentAppraise && currentAppraise.competitorIds ? currentAppraise.competitorIds.split(',') : [],
                })(
                  <Select
                    mode="multiple"
                    placeholder="请选择"
                    style={{width: '100%'}}
                    onChange={this.competitorIdsChange}
                  >
                    {competitors.map((c) => {
                      if (c.id !== currentPointerAddress.id) {
                        return (
                          <Option key={c.id} value={c.id}>
                            {c.name}
                          </Option>
                        );
                      } else {
                        return null;
                      }
                    })}
                  </Select>,
                )}
              </Form.Item>
              <Form.Item label="到访百分比">
                {getFieldDecorator('arriveScale', {
                  initialValue:
                    currentAppraise && currentAppraise.arriveScale ? parseInt(currentAppraise.arriveScale) : 20,
                })(<Slider step={1} max={100} min={20} />)}
              </Form.Item>
              <Form.Item label="辐射距离">
                {getFieldDecorator('distance', {
                  initialValue: currentAppraise && currentAppraise.distance ? parseInt(currentAppraise.distance) : 1000,
                })(
                  <Slider
                    marks={{
                      1000: '1KM',
                      1500: '1.5KM',
                      2000: '2KM',
                      2500: '2.5KM',
                      3000: '3KM',
                    }}
                    step={500}
                    max={3000}
                    min={1000}
                    onChange={this.distanceChange}
                  />,
                )}
              </Form.Item>
              <Form.Item label="存量人口">
                {getFieldDecorator('latlng', {
                  value: '',
                })(<Switch size="small" checkedChildren="显示" unCheckedChildren="不显示" defaultChecked />)}
              </Form.Item>
              <Form.Item label="热力分析">
                <Card id="hotCard">
                  <Row>
                    <Col>
                      <Button type="primary" size="small" onClick={this.onCreateUserFenceHandle}>
                        新建围栏
                      </Button>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      {userHotFencePolygons &&
                        userHotFencePolygons.map((userHotFence) => {
                          return (
                            <Input
                              readOnly
                              key={userHotFence.id}
                              value={userHotFence.options.path.join(';')}
                              suffix={
                                <Tooltip title="删除围栏">
                                  <Icon
                                    type="delete"
                                    style={{color: 'rgba(0,0,0,.45)'}}
                                    onClick={() => {
                                      this.onRemoveUserHotFence(userHotFence);
                                    }}
                                  />
                                </Tooltip>
                              }
                            />
                          );
                        })}
                    </Col>
                  </Row>
                  <Row gutter={10}>
                    <Col span={8}>选择日期:</Col>
                    <Col span={16}>
                      <RangePicker onChange={this.onChange} />
                    </Col>
                  </Row>
                  <Row gutter={10}>
                    <Col>围栏热力条件</Col>
                    <Col>{getFieldDecorator('observerId', {})(<Select />)}</Col>
                  </Row>
                </Card>
              </Form.Item>
              <Form.Item label="测控点">{getFieldDecorator('observerId', {})(<Select />)}</Form.Item>
            </Form>
            <div id="btnbar" style={{marginTop: '20px', display: 'flex', justifyContent: 'flex-end'}}>
              <Button type="primary">保存</Button>&nbsp;
              <Button type="primary">保存并提交</Button>
              <Button type="primary" onClick={this.goBackList}>
                返回列表
              </Button>
            </div>
          </div>
        </Sider>
      </Layout>
    );
  }
}

export default Appraise;
