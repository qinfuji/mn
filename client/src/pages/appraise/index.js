import React from 'react';
import {Layout, Form, Modal} from 'antd';
import Marker from '@/components/AMap/Marker';
import moment from 'moment';
import Polygon from '@/components/AMap/Polygon';
import Circle from '@/components/AMap/Circle';
import InfoWindow from '@/components/AMap/InfoWindow';
import History from '../../core/history';
import Map from '@/components/AMap/Map';
import {
  getEsmtimateByPointerAddressId,
  createEsmtimate,
  getEsmtimateDataResult,
  saveConclusion,
} from '../../services/appraise';
import {fetch as fetchPointerAddress, fetchSharePointerAddress} from '../../services/pointer';
import {
  PolygonOptions,
  CircleOptions,
  ArrivePolygonOptions,
  HotPolygonOptions,
  PointerPolygonOptions,
  CompetitorPolygonOptions,
} from '../../utils/mapShapeOptions';
import {Constant as PointerAddressConstant} from '../../models/pointerAddress';
import {Constant as AppraiseConstant} from '../../models/appraise';
import CreateAppraise from './create';
import Conclusion from './conclusion';
import {generateUUID} from '../../utils/misc';
const {Content, Sider} = Layout;

function getPath(sPath) {
  if (!sPath) return [];
  const pointers = sPath.split(';');
  if (pointers.length >= 3) {
    const path = [];
    pointers.forEach((pointer) => {
      const lnglat = pointer.split(',');
      if (lnglat.length !== 2) return;
      path.push(lnglat);
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
      sharePointerAddressPolyons: [], //业态类型过滤
      appraiseDataResult: {}, //数据结果
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
    if (!response) return;

    const data = response.data;
    const pointerAddress = data.pointerAddress;
    const appraise = data.estimateTask;
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

    let pointerAddressPolygon = null;
    if (pointerAddress.fence) {
      //如果有围栏信息，需要画出围栏信息
      const pointers = getPath(pointerAddress.fence);
      if (pointers.length >= 3) {
        pointerAddressPolygon = this.createPolygon(pointers, false, 'pointerAddressPolygon', pointerAddress, {
          ...PointerPolygonOptions,
        });
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
            {...HotPolygonOptions},
          );
          userHotFencePolygons.push(_polygon);
        }
      });
    }

    let appraiseFencePolygon = null;
    let appraiseDataResult = null;

    if (this.props.location.pathname.indexOf('conclusion') > -1) {
      if (appraise && appraise.execState === AppraiseConstant.execState.EXEC_STATUS_FINISH_CODE) {
        //获取评估
        const appraiseDataResultResponse = await getEsmtimateDataResult({id: appraise.id});
        if (appraiseDataResultResponse) {
          appraiseDataResult = appraiseDataResultResponse.data;
          const fence = appraiseDataResult.fence;
          if (fence) {
            const path = getPath(fence);
            appraiseFencePolygon = this.createPolygon(
              path,
              false,
              'appraiseFencePolygon',
              {
                name: `点址：${pointerAddress.name}<br/>到访围栏`,
                address: '',
              },
              {...ArrivePolygonOptions},
            );
          }
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
              const _polygon = this.createPolygon(
                pointers,
                false,
                'competitorPolygons',
                {
                  name: competitor.name + '(竞品店)',
                  address: competitor.address,
                },
                {...CompetitorPolygonOptions},
              );
              competitorPolygons.push(_polygon);
            }
          }
        });
      });
    }

    //查询共享点址的围栏
    const sharePointerAddressPolyons = [];
    if (appraise && appraise.filterLabels) {
      const sharedPointerAddressRep = await this.getRemoteSharePointerAddress({
        adcode: pointerAddress.district,
        scope: 'district',
        lng: pointerAddress.lng,
        lat: pointerAddress.lat,
        distance: appraise ? appraise.distance : 10000, //默认辐射范围1000米
        labels: appraise.filterLabels,
      });
      if (sharedPointerAddressRep) {
        const spas = sharedPointerAddressRep;
        spas.forEach((spa) => {
          const pointers = getPath(spa.fence);
          if (pointers.length >= 3) {
            const _polygon = this.createPolygon(pointers, false, 'sharePointerAddressPolyons', {
              name: spa.name,
            });
            sharePointerAddressPolyons.push(_polygon);
          }
        });
      }
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
      appraiseDataResult,
      sharePointerAddressPolyons,
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

  getRemoteSharePointerAddress = async ({distance, adcode, scope, lng, lat, labels} = {}) => {
    const response = await fetchSharePointerAddress({distance, adcode, scope, lng, lat, labels});
    if (response) {
      return response.data;
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

  distanceChange = async (value, {filterLabels}) => {
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
    const sharePointerAddressPolyons = [];
    if (filterLabels && filterLabels.length) {
      const sharedPointerAddressRep = await this.getRemoteSharePointerAddress({
        adcode: currentPointerAddress.district,
        scope: 'district',
        lng: currentPointerAddress.lng,
        lat: currentPointerAddress.lat,
        distance: value,
        labels: filterLabels && filterLabels.length !== 0 ? filterLabels.join(',') : null,
      });

      if (sharedPointerAddressRep) {
        const spas = sharedPointerAddressRep;
        spas.forEach((spa) => {
          const pointers = getPath(spa.fence);
          if (pointers.length >= 3) {
            const _polygon = this.createPolygon(pointers, false, 'sharePointerAddressPolyons', {
              name: spa.name,
            });
            sharePointerAddressPolyons.push(_polygon);
          }
        });
      }
    }

    this.setState({
      mapCircles: circles,
      competitors,
      sharePointerAddressPolyons,
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
    windowInfo.address && info.push(`地址 :${windowInfo.address}</div></div>`);
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

  createPolygon = (paths, canEdit, stateProps, windowInfo, extraPolygonOptions = {}) => {
    const id = generateUUID();
    const _polygon = {
      id,
      options: {
        ...PolygonOptions,
        ...extraPolygonOptions,
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

  saveOrUpdate = async (values, type) => {
    //保存
    const {userHotFencePolygons, currentPointerAddress, currentAppraise = {}} = this.state;
    let params = values;
    params = {
      ...currentAppraise,
      ...params,
      filterLabels: params.filterLabels ? params.filterLabels.join(',') : '',
      competitorIds: params.competitorIds ? params.competitorIds.join(',') : '',
      showPersonCount: params.showPersonCount ? 1 : 0,
      arriveScale: params.arriveScale ? params.arriveScale * 10 : 1,
    };
    if (userHotFencePolygons && userHotFencePolygons.length && (!params.fencesHotDate || !params.fenaceHotCondition)) {
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

    const response = await createEsmtimate(params, type);
    if (response) {
      //History.push('/listPointAddress');
      History.push({pathname: '/listPointAddress', search: this.props.location.search});
    }
  };

  onSave = () => {
    this.saveOrUpdate('save');
  };

  onSubmit = () => {
    this.saveOrUpdate('submit');
  };

  goBackList = () => {
    History.push('/listPointAddress');
    History.push({pathname: '/listPointAddress', search: this.props.location.search});
  };

  onSaveConclusion = async (conclusion) => {
    const {currentAppraise} = this.state;
    const response = await saveConclusion(currentAppraise.id, conclusion);
    if (response.data) {
      //History.push('/listPointAddress');
      History.push({pathname: '/listPointAddress', search: this.props.location.search});
    }
  };

  onLabelsChange = async (value, {distance}) => {
    if (!value || value.length === 0) {
      this.setState({
        sharePointerAddressPolyons: [],
      });
      return;
    }
    const {currentPointerAddress} = this.state;
    const params = {
      adcode: currentPointerAddress.district,
      scope: 'district',
      lng: currentPointerAddress.lng,
      lat: currentPointerAddress.lat,
      distance: distance || 1000,
      labels: value.join(','),
    };
    const sharedPointerAddressRep = await this.getRemoteSharePointerAddress(params);
    if (sharedPointerAddressRep) {
      const sharePointerAddressPolyons = [];
      const spas = sharedPointerAddressRep;
      spas.forEach((spa) => {
        const pointers = getPath(spa.fence);
        if (pointers.length >= 3) {
          const _polygon = this.createPolygon(pointers, false, 'sharePointerAddressPolyons', {
            name: spa.name,
          });
          sharePointerAddressPolyons.push(_polygon);
        }
      });

      this.setState({
        sharePointerAddressPolyons,
      });
    }
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
      appraiseDataResult, //结论
      sharePointerAddressPolyons,
    } = this.state;

    const {
      location: {pathname},
    } = this.props;
    console.log(this.props);
    const vtype = pathname.substring(pathname.lastIndexOf('/') + 1);

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

            {sharePointerAddressPolyons &&
              sharePointerAddressPolyons.length &&
              sharePointerAddressPolyons.map((p) => {
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
          {this.props.location.pathname.indexOf('appraise') > -1 && (
            <CreateAppraise
              pointerAddress={currentPointerAddress}
              appraise={currentAppraise}
              onCompetitorIdsChange={this.competitorIdsChange}
              onDistanceChange={this.distanceChange}
              saveOrUpdate={this.saveOrUpdate}
              competitors={competitors}
              userHotFencePolygons={userHotFencePolygons}
              goBackList={this.goBackList}
              onCreateUserFenceHandle={this.onCreateUserFenceHandle}
              onLabelsChange={this.onLabelsChange}
            />
          )}

          {this.props.location.pathname.indexOf('conclusion') > -1 && (
            <Conclusion
              pointerAddress={currentPointerAddress}
              appraiseDataResult={appraiseDataResult}
              goBackList={this.goBackList}
              onSave={this.onSaveConclusion}
            />
          )}
        </Sider>
      </Layout>
    );
  }
}

export default Appraise;
