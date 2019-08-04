import React from 'react';
import {Router} from 'react-router-dom';
import renderRoutes from './core/renderRoutes';
import routes from './routers';
import history from './core/history';
import dvaContainerProvider from './DvaContainer';
import {loadMap, loadPlugin, loadAmpLocaApi, loadAmpUIApi, loadUI} from '@/components/AMap/api';
import moment from 'moment';
import {LocaleProvider} from 'antd';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import 'moment/locale/zh-cn';
import dvaApp from './initDva';
import {fetchUserPermissions} from './services/user';
import {setAuthority} from './utils/authority';
import './App.css';
const DvaConainer = dvaContainerProvider(dvaApp);

moment.locale('zh_CN');

class App extends React.Component {
  state = {initedMap: false};

  componentDidMount() {
    setTimeout(async () => {
      await loadMap(); //加载地图API
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
      const response = await fetchUserPermissions();
      if (response) {
        setAuthority(response.data);
      } else {
        setAuthority(null);
      }
      await this.setState({initedMap: true});
    });
  }

  render() {
    const {initedMap} = this.state;
    return initedMap ? (
      <DvaConainer>
        <LocaleProvider locale={zh_CN}>
          <Router history={history}>{renderRoutes(routes, {})}</Router>
        </LocaleProvider>
      </DvaConainer>
    ) : null;
  }
}

export default App;
