import React from 'react';
import {loadMap, loadPlugin} from '@/components/AMap/api';
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
      await loadMap({
        key: 'f7afe9ac13d8d7afcfdd07b8e8e551fa',
        useAMapUI: function() {
          window.AMapUI.load(['ui/geo/DistrictExplorer', 'lib/$', 'ui/misc/PositionPicker']);
        },
      });
      await loadPlugin([
        'AMap.PlaceSearch',
        'AMap.Geolocation',
        'AMap.Scale',
        'AMap.ToolBar',
        'AMap.Geocoder',
        'AMap.MouseTool',
      ]);
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
