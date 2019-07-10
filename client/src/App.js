import React from 'react';
import {Router} from 'react-router-dom';
import renderRoutes from './core/renderRoutes';
import routes from './routers';
import Layout from './layouts/Layout';
import history from './core/history';
import dvaContainerProvider from './DvaContainer';
import {loadMap, loadPlugin, loadAmpLocaApi, loadAmpUIApi, loadUI} from '@/components/AMap/api';
import moment from 'moment';
import {LocaleProvider} from 'antd';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import 'moment/locale/zh-cn';
import dvaApp from './initDva';
import './App.css';
const DvaConainer = dvaContainerProvider(dvaApp);

moment.locale('zh_CN');

class App extends React.Component {
  state = {initedMap: false};

  componentDidMount() {
    setTimeout(async () => {
      await loadMap(); //加载地图API
      console.log(window.AMap.Scale);
      // this.scale = new window.AMap.Scale({
      //   visible: true,
      // });
      await loadAmpUIApi(); //加载UI api
      await loadPlugin([
        'AMap.PlaceSearch',
        'AMap.Geolocation',
        'AMap.Scale',
        'AMap.ToolBar',
        'AMap.Geocoder',
        'AMap.MouseTool',
        'AMap.CircleEditor',
        'AMap.PolyEditor',
      ]);
      await loadAmpLocaApi(); //加载loca api
      this.setState({initedMap: true});
    });
  }

  render() {
    const {initedMap} = this.state;
    return initedMap ? (
      <DvaConainer>
        <LocaleProvider locale={zh_CN}>
          <Layout>
            <Router history={history}>{renderRoutes(routes, {})}</Router>
          </Layout>
        </LocaleProvider>
      </DvaConainer>
    ) : null;
  }
}

export default App;
