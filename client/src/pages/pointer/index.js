import React from 'react';
import {connect} from 'dva';
import {loadMap, loadPlugin, loadAmpLocaApi, loadAmpUIApi, loadUI} from '@/components/AMap/api';
import Map from '@/components/AMap/Map';
import Marker from '@/components/AMap/Marker';
import {Layout, Form, Row, Col, Select, Button, Input, Icon} from 'antd';
const {Header, Content, Footer, Sider} = Layout;

const FormItem = Form.Item;
const Option = Select.Option;

function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some((field) => fieldsError[field]);
}

@Form.create()
class PointManager extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      initedMap: false,
    };
  }

  componentDidMount() {
    setTimeout(async () => {
      await loadMap(); //加载地图API
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

  itemLayout = {
    labelCol: {span: 9},
    wrapperCol: {span: 15},
  };

  renderSearch = () => {
    const {getFieldDecorator, getFieldsError, getFieldError, isFieldTouched} = this.props.form;

    // Only show error after a field is touched.
    const usernameError = isFieldTouched('username') && getFieldError('username');
    const passwordError = isFieldTouched('password') && getFieldError('password');
    return (
      <Form layout="inline" onSubmit={this.handleSubmit}>
        <Form.Item label="省" validateStatus={usernameError ? 'error' : ''} help={usernameError || ''}>
          {getFieldDecorator('username')(
            <Input prefix={<Icon type="user" style={{color: 'rgba(0,0,0,.25)'}} />} placeholder="Username" />,
          )}
        </Form.Item>
        <Form.Item label="市">
          {getFieldDecorator('password')(
            <Input
              prefix={<Icon type="lock" style={{color: 'rgba(0,0,0,.25)'}} />}
              type="password"
              placeholder="Password"
            />,
          )}
        </Form.Item>
        <Form.Item label="区县">
          {getFieldDecorator('password')(
            <Input
              prefix={<Icon type="lock" style={{color: 'rgba(0,0,0,.25)'}} />}
              type="password"
              placeholder="Password"
            />,
          )}
        </Form.Item>
        <Form.Item label="地址">
          {getFieldDecorator('password')(
            <Input
              prefix={<Icon type="lock" style={{color: 'rgba(0,0,0,.25)'}} />}
              type="password"
              placeholder="Password"
            />,
          )}
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" disabled={hasErrors(getFieldsError())}>
            查询
          </Button>
        </Form.Item>
      </Form>
    );
  };

  render() {
    const {initedMap} = this.state;
    return (
      <Layout style={{width: '100%', height: '100%'}}>
        <Header style={{background: '#fff', paddingTop: '10px', borderBottom: '1px solid #615a5a42'}}>
          <div style={{float: 'left'}}>{this.renderSearch()}</div>
          <div style={{float: 'right'}}>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                新建点址
              </Button>
            </Form.Item>
          </div>
        </Header>
        <Layout>
          <Content>
            {initedMap && (
              <Map
                style={{width: '100%', height: '100%'}}
                options={{center: [116.480983, 39.989628], mapStyle: 'amap://styles/ab2c0d8d125f8d8556e453149622a5a2'}}
                events={{}}
              >
                <Marker
                  refer={(entity) => this.setState({carEntity: entity})}
                  options={{
                    position: [116.480983, 39.989628],
                    icon: 'https://webapi.amap.com/images/car.png',
                    //offset: this.state.carOffset,
                    autoRotation: true,
                  }}
                  // events={{
                  //   moving: this._carMoving,
                  // }}
                />
              </Map>
            )}
          </Content>
          <Sider theme="light" width="25%"></Sider>
        </Layout>
      </Layout>
    );
  }
}

export default PointManager;
