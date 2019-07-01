import React from 'react';
import {connect} from 'dva';
import Marker from '@/components/AMap/Marker';
import Circle from '@/components/AMap/Circle';
import {Layout, Form, Row, Col, Select, Button, Input, Icon} from 'antd';
import localData from '../../utils/adcode.json';
import SearchResultList from './searchResultList';
import CreatePointer from './createPoint';
import AMap from './Map';
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

const MODEL_CREATE = 'createPointer';
const MODEL_POI_LIST = 'poiList';

@Form.create()
class PointManager extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      initedMap: false,
      province: '',
      city: '',
      district: '',
      mapCenter: null,
      currentAdcode: '',
      mapCircles: [],
      mapMarkers: [],
      mapPolygons: [],
      mapZoom: 4,
      mapNeedClear: false,
      rightMode: null,
    };
  }

  componentDidMount() {}

  itemLayout = {
    labelCol: {span: 9},
    wrapperCol: {span: 15},
  };

  provinceChange = (value) => {
    const {form} = this.props;
    form.setFieldsValue({city: null, district: null});
    if (value)
      this.setState({
        currentAdcode: value,
      });
  };

  cityChange = (value) => {
    const {form} = this.props;
    form.setFieldsValue({district: null});
    if (value)
      this.setState({
        currentAdcode: value,
      });
  };

  districtChange = (value) => {
    if (value)
      this.setState({
        currentAdcode: value,
      });
  };

  onSearch = async (e) => {
    e.preventDefault();
    this.keywordSearch({});
  };

  keywordSearch = ({pageIndex = 1, pageSize = 20, ...reset}) => {
    const {form} = this.props;
    const address = form.getFieldValue('address');
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
          rightMode: MODEL_POI_LIST,
        });
        return resolve(result);
      });
    });
  };

  renderSearch = () => {
    const {getFieldDecorator, getFieldValue} = this.props.form;
    const province = getFieldValue('province');
    const city = getFieldValue('city');
    const citys = localData.city[province] || [];
    const districts = localData.district[city] || [];
    return (
      <Form layout="inline" onSubmit={this.onSearch}>
        <Form.Item label="省">
          {getFieldDecorator('province', {
            initialValue: province || 100000,
          })(
            <Select allowClear placeholder="请选择" style={{width: 150}} onChange={this.provinceChange}>
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
            <Select allowClear placeholder="请选择" style={{width: 150}} onChange={this.cityChange}>
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
            <Select allowClear placeholder="请选择" style={{width: 150}} onChange={this.districtChange}>
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
        <Form.Item label="地址">{getFieldDecorator('address', {})(<Input></Input>)}</Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            查询
          </Button>
        </Form.Item>
      </Form>
    );
  };

  onPoiListPageChange = (pageIndex) => {
    this.keywordSearch({pageIndex});
  };

  onPoiListItemSelected = (item) => {
    const location = item.location;
    var options = {
      strokeColor: '#F33', //线颜色
      strokeOpacity: 0.05, //线透明度
      strokeWeight: 0.05, //线粗细度
      fillColor: '#ee2200', //填充颜色
      fillOpacity: 0.05, //填充透明度
      bubble: true,
    };
    const center = [location.lng, location.lat];
    const circle1 = Object.assign(
      {
        id: generateUUID(),
        center, // 圆心位置
        radius: 20, //半径
      },
      options,
    );

    const circle2 = Object.assign(
      {
        id: generateUUID(),
        center, // 圆心位置
        radius: 500, //半径
      },
      options,
    );

    const circle3 = Object.assign(
      {
        id: generateUUID(),
        center, // 圆心位置
        radius: 1500, //半径
      },
      options,
    );

    const circles = [circle1, circle2, circle3];
    this.setState({
      mapCircles: circles,
      mapCenter: center,
      mapZoom: 15,
      mapNeedClear: true,
    });
  };

  createPointer = () => {
    this.setState({
      rightMode: MODEL_CREATE,
    });
  };

  createPointerMarker = (e) => {
    const lnglat = e.lnglat;
    const marker = {
      id: generateUUID(),
      type: 'new',
      position: [lnglat.lng, lnglat.lat],
      offset: new window.AMap.Pixel(-13, -30),
      draggable: true,
      cursor: 'move',
    };

    this.setState({
      mapMarkers: [marker],
    });
  };

  render() {
    const {
      poiList = [],
      rightMode,
      currentAdcode = 100000,
      mapCenter,
      mapNeedClear,
      mapZoom = 4,
      mapCircles,
      mapMarkers,
    } = this.state;
    return (
      <Layout style={{width: '100%', height: '100%'}}>
        <Header style={{background: '#fff', paddingTop: '10px', borderBottom: '1px solid #615a5a42'}}>
          <div style={{float: 'left'}}>{this.renderSearch()}</div>
          <div style={{float: 'right'}}>
            <Form.Item>
              <Button type="primary" htmlType="submit" onClick={this.createPointer}>
                新建点址
              </Button>
            </Form.Item>
          </div>
        </Header>
        <Layout style={{width: '100%', height: '100%'}}>
          <Content>
            <AMap
              events={{
                click: this.createPointerMarker,
              }}
              center={mapCenter}
              currentAdcode={currentAdcode}
              zoom={mapZoom}
              clean={mapNeedClear}
            >
              {mapCircles &&
                mapCircles.length &&
                mapCircles.map((c) => {
                  return <Circle key={c.id} options={c} />;
                })}

              {mapMarkers &&
                mapMarkers.length &&
                mapMarkers.map((c) => {
                  return <Marker key={c.id} options={c} />;
                })}
            </AMap>
          </Content>
          <Sider theme="light" width={rightMode ? '25%' : '1px'} style={{height: '100%', overflow: 'auto'}}>
            {rightMode === MODEL_POI_LIST && (
              <SearchResultList
                poiList={poiList}
                onPageChange={this.onPoiListPageChange}
                onItemSelected={this.onPoiListItemSelected}
              />
            )}
            {rightMode === MODEL_CREATE && <CreatePointer />}
          </Sider>
        </Layout>
      </Layout>
    );
  }
}

export default PointManager;
