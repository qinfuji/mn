//just some colors
var mapContainerId = "container";
var map;
var colors = [
  "#3366cc",
  "#dc3912",
  "#ff9900",
  "#109618",
  "#990099",
  "#0099c6",
  "#dd4477",
  "#66aa00",
  "#b82e2e",
  "#316395",
  "#994499",
  "#22aa99",
  "#aaaa11",
  "#6633cc",
  "#e67300",
  "#8b0707",
  "#651067",
  "#329262",
  "#5574a6",
  "#3b3eac"
];

$(document).ready(function() {
  //加载地图库
  loadEvn().then(function(env) {
    return new Promise(function(resolve, reject) {
      //初始化地图
      initExplorerMap(env);
    });
  });
  //初始化机会点列表
  initChanceList();
});

function loadEvn() {
  return new Promise(function(resolve, reject) {
    AMapUI.load(
      ["ui/geo/DistrictExplorer", "lib/$", "ui/misc/PositionPicker"],
      function(DistrictExplorer, $, PoiPicker) {
        resolve({
          DistrictExplorer: DistrictExplorer,
          $: $,
          PoiPicker: PoiPicker
        });
      }
    );
  }).then(function(env) {
    return new Promise(function(resolve) {
      AMap.plugin(
        [
          "AMap.PlaceSearch",
          "AMap.Geolocation",
          "AMap.PlaceSearch",
          "AMap.Scale",
          "AMap.ToolBar"
        ],
        function() {
          //异步加载插件
          resolve(env);
        }
      );
    });
  });
}

function initExplorerMap(env) {
  map = new AMap.Map(mapContainerId, {
    zoom: 4,
    mapStyle: "amap://styles/ab2c0d8d125f8d8556e453149622a5a2"
  });
  var DistrictExplorer = env.DistrictExplorer;
  var $ = env.$;
  var PoiPicker = env.PoiPicker;
  //创建一个实例
  var districtExplorer = (window.districtExplorer = new DistrictExplorer({
    eventSupport: true, //打开事件支持
    map: map
  }));

  var scale = new AMap.Scale({
      visible: true
    }),
    toolBar = new AMap.ToolBar({
      visible: true
    });

  map.addControl(scale);
  map.addControl(toolBar);
  //当前聚焦的区域
  var currentAreaNode = null;
  //鼠标hover提示内容
  var $tipMarkerContent = $('<div class="tipMarker top"></div>');
  var tipMarker = new AMap.Marker({
    content: $tipMarkerContent.get(0),
    offset: new AMap.Pixel(0, 0),
    bubble: true
  });

  //根据Hover状态设置相关样式
  function toggleHoverFeature(feature, isHover, position) {
    tipMarker.setMap(isHover ? map : null);

    if (!feature) {
      return;
    }
    var props = feature.properties;
    if (isHover) {
      //更新提示内容
      $tipMarkerContent.html(props.adcode + ": " + props.name);
      //更新位置
      tipMarker.setPosition(position || props.center);
    }

    //更新相关多边形的样式
    var polys = districtExplorer.findFeaturePolygonsByAdcode(props.adcode);
    for (var i = 0, len = polys.length; i < len; i++) {
      polys[i].setOptions({
        fillOpacity: isHover ? 0.5 : 0.2
      });
    }
  }

  //监听feature的hover事件
  districtExplorer.on("featureMouseout featureMouseover", function(e, feature) {
    toggleHoverFeature(
      feature,
      e.type === "featureMouseover",
      e.originalEvent ? e.originalEvent.lnglat : null
    );
  });

  //监听鼠标在feature上滑动
  districtExplorer.on("featureMousemove", function(e, feature) {
    //更新提示位置
    tipMarker.setPosition(e.originalEvent.lnglat);
  });

  //feature被点击
  districtExplorer.on("featureClick", function(e, feature) {
    console.log("featureClick");
    var props = feature.properties;
    //如果存在子节点
    //if (props.childrenNum > 0) {
    //切换聚焦区域
    switch2AreaNode(props.adcode);
    //}
  });

  //外部区域被点击
  districtExplorer.on("outsideClick", function(e) {
    console.log("outsideClick");
    districtExplorer.locatePosition(
      e.originalEvent.lnglat,
      function(error, routeFeatures) {
        if (routeFeatures && routeFeatures.length > 1) {
          //切换到省级区域
          switch2AreaNode(
            routeFeatures[routeFeatures.length - 2].properties.adcode
          );
        } else {
          //切换到全国
          switch2AreaNode(100000);
        }
      },
      {
        levelLimit: 4
      }
    );
  });

  //绘制某个区域的边界
  function renderAreaPolygons(areaNode) {
    //更新地图视野
    map.setBounds(areaNode.getBounds(), null, null, true);
    //清除已有的绘制内容
    districtExplorer.clearFeaturePolygons();
    //绘制子区域
    districtExplorer.renderSubFeatures(areaNode, function(feature, i) {
      var fillColor = colors[i % colors.length];
      var strokeColor = colors[colors.length - 1 - (i % colors.length)];
      return {
        cursor: "default",
        bubble: true,
        strokeColor: strokeColor, //线颜色
        strokeOpacity: 1, //线透明度
        strokeWeight: 1, //线宽
        fillColor: fillColor, //填充色
        fillOpacity: 0.35 //填充透明度
      };
    });

    //绘制父区域
    districtExplorer.renderParentFeature(areaNode, {
      cursor: "default",
      bubble: true,
      strokeColor: "black", //线颜色
      strokeOpacity: 1, //线透明度
      strokeWeight: 1, //线宽
      fillColor: areaNode.getSubFeatures().length ? null : colors[0], //填充色
      fillOpacity: 0.35 //填充透明度
    });
  }

  //切换区域后刷新显示内容
  function refreshAreaNode(areaNode) {
    districtExplorer.setHoverFeature(null);
    renderAreaPolygons(areaNode);
  }

  //切换区域
  function switch2AreaNode(adcode, callback) {
    if (currentAreaNode && "" + currentAreaNode.getAdcode() === "" + adcode) {
      return;
    }
    loadAreaNode(adcode, function(error, areaNode) {
      if (error) {
        if (callback) {
          callback(error);
        }
        return;
      }
      currentAreaNode = window.currentAreaNode = areaNode;
      console.log(areaNode);
      //设置当前使用的定位用节点
      districtExplorer.setAreaNodesForLocating([currentAreaNode]);
      refreshAreaNode(areaNode);
      if (callback) {
        callback(null, areaNode);
      }
    });
  }

  //加载区域
  function loadAreaNode(adcode, callback) {
    districtExplorer.loadAreaNode(adcode, function(error, areaNode) {
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
  }

  //全国
  switch2AreaNode(100000, function(err, areaNode) {
    console.log(areaNode);
  });
}

function initMyMap({ map, DistrictExplorer, $, PoiPicker, ajax }) {
  /**
   * 初始化机会点列表
   * @return 返回机会点对象列表
   */
  function initChanceList() {}

  /**
   * 绘制区域内的机会点
   */
  function renderAreaChances(areaNode) {}
  /**
   * 查询某个区域内的所有机会点
   */
  function searchChanceList(areaNode) {
    return new Promise(function(resolve, reject) {
      ajax.get("", {});
    });
  }
  /**
   * 设置机会点
   * @param map 地图对象
   * @param position  机会点坐标
   * @param params  相关参数
   * @return 返回相关对象
   */
  function setChancePoint(position, params) {}

  /**
   * 更新机会点数据
   */
  function updateChancePointInfo() {}

  /**
   * 创建机会点
   * @param chancePointInfo
   */
  function createChancePoint(chancePointInfo) {}
  /**
   * 获取当前用户的位置信息
   */
  function locationSelf() {
    var options = {
      showButton: true, //是否显示定位按钮
      buttonPosition: "LB", //定位按钮的位置
      /* LT LB RT RB */
      buttonOffset: new AMap.Pixel(10, 20), //定位按钮距离对应角落的距离
      showMarker: true, //是否显示定位点
      markerOptions: {
        //自定义定位点样式，同Marker的Options
        offset: new AMap.Pixel(-18, -36),
        content:
          '<img src="https://a.amap.com/jsapi_demos/static/resource/img/user.png" style="width:36px;height:36px"/>'
      },
      showCircle: true, //是否显示定位精度圈
      circleOptions: {
        //定位精度圈的样式
        strokeColor: "#0093FF",
        noSelect: true,
        strokeOpacity: 0.5,
        strokeWeight: 1,
        fillColor: "#02B0FF",
        fillOpacity: 0.25
      }
    };

    var geolocation = new AMap.Geolocation(options);
    map.addControl(geolocation);
    geolocation.getCurrentPosition();
  }

  /**
   * POI查询
   * @param keywords 查询关键字
   * @param currentAreaNode 当前区域节点
   */
  function keywordSearch(keywords, currentAreaNode, options = {}) {
    var autoOptions = Object.assign(
      {
        pageSize: 20, //查询的分页
        extensions: "all" //返回基本+详细信息
      },
      options
    );
    if (currentAreaNode) {
      autoOptions.city = currentAreaNode.adcode;
      autoOptions.citylimit = true;
    }
    var placeSearch = new AMap.PlaceSearch(autoOptions);
    return new Promise(function(resolve, reject) {
      placeSearch.search(keywords, function(status, result) {
        if (status === "error") {
          return reject(result);
        } else if (status === "no_data") {
          return resolve([]);
        }
        return resolve(result);
      });
    });
  }

  return {
    keywordSearch,
    locationSelf
  };
}

/**
 * 刻度转化
 */
function scale2Zoom(scale) {
  if (scale <= 10) return 19;
  else if (scale <= 25) return 18;
  else if (scale <= 50) return 17;
  else if (scale <= 100) return 16;
  else if (scale <= 200) return 15;
  else if (scale <= 500) return 14;
  else if (scale <= 1000) return 13;
  else if (scale <= 2000) return 12;
  else if (scale <= 5000) return 11;
  else if (scale <= 10000) return 10;
  else if (scale <= 20000) return 9;
  else if (scale <= 30000) return 8;
  else if (scale <= 50000) return 7;
  else if (scale <= 100000) return 6;
  else if (scale <= 200000) return 5;
  else if (scale <= 500000) return 4;
  else if (scale <= 1000000) return 3;
  else if (scale > 1000000) return 2;
  return 20;
}
