import React from 'react';
import {loadMap, loadPlugin, loadAmpLocaApi, loadAmpUI} from '@/components/AMap/api';
import Map from '@/components/AMap/Map';
import Marker from '@/components/AMap/Marker';

class PointManager extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      initedMap: false,
    };
  }

  componentDidMount() {
    setTimeout(async () => {
      await loadMap();
      await loadAmpUI();
      await loadPlugin([
        'AMap.PlaceSearch',
        'AMap.Geolocation',
        'AMap.Scale',
        'AMap.ToolBar',
        'AMap.Geocoder',
        'AMap.MouseTool',
      ]);
      await loadAmpLocaApi();
      this.setState({initedMap: true});
    });
  }

  render() {
    const {initedMap} = this.state;
    return (
      initedMap && (
        <Map
          style={{width: 1200, height: 800}}
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
      )
    );
  }
}

export default PointManager;
