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
import moment from 'moment';
import Polygon from '@/components/AMap/Polygon';
import Circle from '@/components/AMap/Circle';
import InfoWindow from '@/components/AMap/InfoWindow';
import History from '../../core/history';
import Map from '@/components/AMap/Map';
import {getEsmtimateByPointerAddressId, createEsmtimate, getEsmtimateDataResult} from '../../services/appraise';
import {fetch as fetchPointerAddress} from '../../services/pointer';
import {PolygonOptions, CircleOptions} from '../../utils/mapShapeOptions';
import {Constant as PointerAddressConstant} from '../../models/pointerAddress';
import {Constant as AppraiseConstant} from '../../models/appraise';
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
      currentPointerAddress: {},
      competitors: [], //竞品店
      userHotFencePolygons: [], //热力围栏
      pointerAddressPolygon: null,
      pointerAddressMarker: null,
      competitorPolygons: [], //竞品店围栏
      filterLabelPolygons: [], //过滤的业态围栏
      appraiseFencePolygon: null, //点址评估后的围栏
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
    const appraise = data.estimateTask;
    const markers = [];
    const polygons = [];
    const circles = [];
    console.log(appraise);
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

    let pointerAddressPolygon = null;
    if (pointerAddress.fence) {
      //如果有围栏信息，需要画出围栏信息
      const pointers = getPath(pointerAddress.fence);
      if (pointers.length >= 3) {
        pointerAddressPolygon = this.createPolygon(pointers, false, 'pointerAddressPolygon', pointerAddress);
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

    //热力围栏
    const userHotFencePolygons = [];
    if (appraise && appraise.hotFences) {
      const hotfences = appraise.hotFences.split('|');
      hotfences.forEach((hotfence) => {
        const pointers = getPath(hotfence);
        if (pointers.length >= 3) {
          const _polygon = this.createPolygon(
            pointers,
            appraise.state === AppraiseConstant.status.STATUS_WAIT_COMMIT,
            'userHotFencePolygons',
            {name: '热力围栏', address: ''},
          );
          userHotFencePolygons.push(_polygon);
        }
      });
    }

    let appraiseFencePolygon = null;
    if (appraise && appraise.execState === AppraiseConstant.execState.EXEC_STATUS_FINISH_CODE) {
      //获取评估
      const appraiseDataResultResponse = await getEsmtimateDataResult({id: appraise.id});
      if (appraiseDataResultResponse) {
        const dataResultResponse = appraiseDataResultResponse.data;
        const fence = dataResultResponse.fence;
        if (fence) {
          console.log(fence);
          const path = getPath(fence);
          appraiseFencePolygon = this.createPolygon(path, false, 'appraiseFencePolygon', {
            name: '辐射围栏',
            address: '',
          });
        }
      }
    }

    //竞品店围栏
    const competitorPolygons = [];
    if (appraise && appraise.competitorIds && appraise.competitorIds.length && competitors && competitors.length) {
      const competitorIds = appraise.competitorIds.split(',');
      competitorIds.forEach((competitorId) => {
        competitors.forEach((competitor) => {
          if (competitorId === competitor.id) {
            const pointers = getPath(competitor.fence);
            if (pointers.length >= 3) {
              const _polygon = this.createPolygon(pointers, false, 'competitorPolygons', {
                name: competitor.name + '(竞品店)',
                address: competitor.address,
              });
              competitorPolygons.push(_polygon);
            }
          }
        });
      });
    }

    this.setState({
      mapZoom: 15,
      mapCenter: center,
      mapMarkers: markers,
      mapCircles: circles,
      mapPolygons: polygons,
      currentPointerAddress: pointerAddress,
      pointerAddressMarker,
      pointerAddressPolygon,
      currentAppraise: appraise,
      userHotFencePolygons,
      competitors,
      competitorPolygons,
      appraiseFencePolygon,
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
  getObserveIds = async () => {};

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

  createCompetitorIds = (competitorIds, competitors) => {
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
    return polygons;
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

  openCreateInfoWindiw = (lnglat, windowInfo) => {
    //构建信息窗体中显示的内容
    var info = [];
    info.push(`<div style="padding:0px 0px 0px 4px;"><b>名称:${windowInfo.name}</b>`);
    info.push(`地址 :${windowInfo.address}</div></div>`);
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
            const polygon = this.createPolygon(pathArray, true, 'userHotFencePolygons', {
              name: '热力围栏',
              address: '',
            });
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

  createPolygon = (paths, canEdit, stateProps, windowInfo) => {
    const id = generateUUID();
    const _polygon = {
      id,
      options: {
        ...PolygonOptions,
        id,
        path: paths,
        editable: canEdit
          ? {
              events: {
                adjust: (e) => {
                  const path = e.target.getPath();
                  const pythone = this.createPolygon(getPath(path.join(';')), true, stateProps, windowInfo);
                  pythone.id = id;
                  const userHotFencePolygons = this.state[stateProps] || [];
                  const newUserHotFances = userHotFencePolygons.reduce((ret, fence) => {
                    if (fence.id === id) {
                      ret.push(pythone);
                    } else {
                      ret.push({...fence, options: {...fence.options}});
                    }
                    return ret;
                  }, []);
                  this.setState({
                    [stateProps]: newUserHotFances,
                  });
                },
              },
            }
          : null,
      },

      events: {
        click: (e) => {
          windowInfo && this.openCreateInfoWindiw(e.lnglat, windowInfo);
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

  saveOrUpdate = async (type) => {
    //保存
    const {
      form: {validateFields},
    } = this.props;
    const {userHotFencePolygons, currentPointerAddress, currentAppraise = {}} = this.state;
    validateFields(async (error, values) => {
      if (error) return;
      let params = values;
      params = {
        ...currentAppraise,
        ...params,
        filterLabels: params.filterLabels ? params.filterLabels.join(',') : '',
        competitorIds: params.competitorIds ? params.competitorIds.join(',') : '',
      };

      if (
        userHotFencePolygons &&
        userHotFencePolygons.length &&
        (!params.fencesHotDate || !params.fenaceHotCondition)
      ) {
        Modal.error({
          title: '热力分析日期、热力条件必须填写',
        });
        return;
      }
      if (userHotFencePolygons && userHotFencePolygons.length) {
        const fancesArray = [];
        userHotFencePolygons.forEach((fence) => {
          const path = fence.options.path;
          fancesArray.push(path.join(';'));
        });
        params.hotFences = fancesArray.join('|');
      }
      if (userHotFencePolygons && userHotFencePolygons.length && params.fencesHotDate) {
        const stateDate = params.fencesHotDate[0];
        const endDate = params.fencesHotDate[1];
        params.fencesHotDate = moment(stateDate).format('YYYY-MM-DD') + ';' + moment(endDate).format('YYYY-MM-DD');
      } else {
        params.fencesHotDate = '';
      }
      params.pointerAddressId = currentPointerAddress.id;
      console.log(params);
      const response = await createEsmtimate(params, type);
      if (response) {
        History.push('/listPointAddress');
      }
    });
  };

  onSave = () => {
    this.saveOrUpdate('save');
  };

  onSubmit = () => {
    this.saveOrUpdate('submit');
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
      pointerAddressMarker, //点址marker
      pointerAddressPolygon, //点址围栏
      competitorPolygons, //竞品店围栏
      appraiseFencePolygon, //统计分析后的点址围栏
    } = this.state;
    console.log(this.state);
    const {
      form: {getFieldDecorator},
    } = this.props;

    const fenceHotDate = [];
    if (currentAppraise && currentAppraise.fencesHotDate) {
      const strDates = currentAppraise.fencesHotDate.split(';');
      fenceHotDate.push(moment(strDates[0]));
      fenceHotDate.push(moment(strDates[1]));
    }
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

            {pointerAddressMarker && (
              <Marker
                key={pointerAddressMarker.id}
                options={pointerAddressMarker.options}
                events={pointerAddressMarker.events}
              />
            )}

            {pointerAddressPolygon && (
              <Polygon
                key={pointerAddressPolygon.id}
                options={pointerAddressPolygon.options}
                events={pointerAddressPolygon.events}
              />
            )}

            {appraiseFencePolygon && (
              <Polygon
                key={appraiseFencePolygon.id}
                options={appraiseFencePolygon.options}
                events={appraiseFencePolygon.events}
              />
            )}

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

            {competitorPolygons &&
              competitorPolygons.length &&
              competitorPolygons.map((p) => {
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
                {getFieldDecorator('filterLabels', {
                  initialValue:
                    currentAppraise && currentAppraise.filterLabels ? currentAppraise.filterLabels.split(',') : [],
                })(
                  <Select mode="multiple">
                    <Option value={'1'}>标签1</Option>
                    <Option value={'2'}>标签2</Option>
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
                {getFieldDecorator('showPersonCount', {
                  initialValue:
                    currentAppraise && currentAppraise.showPersonCount ? parseInt(currentAppraise.showPersonCount) : 1,
                })(<Switch size="small" checkedChildren="显示" unCheckedChildren="不显示" defaultChecked />)}
              </Form.Item>
              <Form.Item label="热力分析">
                <Card id="hotCard">
                  <Row>
                    <Col>
                      {(!currentAppraise ||
                        (currentAppraise && currentAppraise.state === AppraiseConstant.status.STATUS_WAIT_COMMIT)) && (
                        <Button type="primary" size="small" onClick={this.onCreateUserFenceHandle}>
                          新建围栏
                        </Button>
                      )}
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
                                (!currentAppraise ||
                                  (currentAppraise &&
                                    currentAppraise.state === AppraiseConstant.status.STATUS_WAIT_COMMIT)) && (
                                  <Tooltip title="删除围栏">
                                    <Icon
                                      type="delete"
                                      style={{color: 'rgba(0,0,0,.45)'}}
                                      onClick={() => {
                                        this.onRemoveUserHotFence(userHotFence);
                                      }}
                                    />
                                  </Tooltip>
                                )
                              }
                            />
                          );
                        })}
                    </Col>
                  </Row>
                  <Row gutter={10}>
                    <Col span={8}>选择日期:</Col>
                    <Col span={16}>
                      {getFieldDecorator('fencesHotDate', {
                        initialValue: fenceHotDate,
                      })(<RangePicker />)}
                    </Col>
                  </Row>
                  <Row gutter={10}>
                    <Col>围栏热力条件</Col>
                    <Col>
                      {getFieldDecorator('fenaceHotCondition', {
                        initialValue:
                          currentAppraise && currentAppraise.fenaceHotCondition
                            ? currentAppraise.fenaceHotCondition
                            : '',
                      })(
                        <Select>
                          <Option value={'1'}>人口</Option>
                        </Select>,
                      )}
                    </Col>
                  </Row>
                </Card>
              </Form.Item>
              <Form.Item label="测控点">
                {getFieldDecorator('observeId', {
                  initialValue: currentAppraise && currentAppraise.observeId ? currentAppraise.observeId : '',
                  rules: [{required: true, message: '请选择'}],
                })(
                  <Select>
                    <Option value={'1221212'}>测控点1</Option>
                  </Select>,
                )}
              </Form.Item>
            </Form>
            <div id="btnbar" style={{marginTop: '20px'}}>
              {(!currentAppraise ||
                (currentAppraise && currentAppraise.state === AppraiseConstant.status.STATUS_WAIT_COMMIT)) && (
                <Button size="small" type="primary" onClick={this.onSave}>
                  保存
                </Button>
              )}
              {(!currentAppraise ||
                (currentAppraise && currentAppraise.state === AppraiseConstant.status.STATUS_WAIT_COMMIT)) && (
                <Button size="small" type="primary" onClick={this.onSubmit}>
                  保存并提交
                </Button>
              )}
              <Button size="small" type="primary" onClick={this.goBackList}>
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
