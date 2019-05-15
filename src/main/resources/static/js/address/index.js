//just some colors
var mapContainerId = "mapcontainer";
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
      initMap(env);
    });
  });
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
          "AMap.Scale",
          "AMap.ToolBar",
          "AMap.Geocoder"
        ],
        function() {
          //异步加载插件
          resolve(env);
        }
      );
    });
  });
}

/**************redux************* */

var ActionTypes = {
  UPDATE_CHANCE: "updateChance", //设置机会点坐标
  UPDATE_CHANGE_PROP: "updateChanceProp", //更新属性
  DELETE_CHANCE: "deleteChance", //删除机会点
  ADD_CHANCE: "addChance", //添加机会点
  UPDATE_CHANCE_LIST: "updateChanceList", //更新机会点列表
  UPDATE_SEARCH_LIST: "updateSearchList", //查询结果
  UPDATE_MAP_LOCATION: "updateLocation" //更新地图的位置
};

/**
 * 更新机会点
 */
function updateChance(chance) {
  return function(dispatch) {
    dispatch({
      type: ActionTypes.UPDATE_CHANCE,
      payload: chance
    });
  };
}

/**
 * 修改地图位置
 */
function updateMapLocation(lng, lat) {
  return function(dispatch) {
    dispatch({
      type: ActionTypes.UPDATE_MAP_LOCATION,
      payload: [lng, lat]
    });
  };
}

/**
 * 更新属性
 */
function updateChanceProp(propName, propValue) {
  return function(dispatch) {
    dispatch({
      type: ActionTypes.UPDATE_CHANGE_PROP,
      payload: {
        propName: propName,
        propValue: propValue
      }
    });
  };
}

/**
 * 查询机会点列表
 */
function queryChanceList(adcodeLimit) {
  return function(dispatch) {
    return new Promise(function(resolve, reject) {
      var test = [
        {
          name: "肯德基1",
          chance_id: "ABC1",
          id: 1,
          fence: "", //围栏
          province: "", //省
          provinceName: "",
          city: "",
          cityName: "",
          district: "",
          districtName: "",
          address: "湖北省潜江市园林街道县河街11号",
          lnglat: "112.900765,30.41671"
        },
        {
          name: "肯德基2",
          chance_id: "ABC2",
          id: 2,
          fence: "", //围栏
          province: "", //省
          provinceName: "",
          city: "",
          cityName: "",
          district: "",
          districtName: "",
          address:
            "湖北省潜江市园林街道园林三小艺术幼儿园潜江市自然资源和规划局",
          lnglat: "112.902101,30.415831"
        },
        {
          name: "肯德基3",
          chanceId: "ABC3",
          id: 3,
          fence: "", //围栏
          province: "", //省
          provinceName: "",
          city: "",
          cityName: "",
          district: "",
          districtName: "",
          address: "湖北省潜江市泰丰街道健康巷121号",
          lnglat: "112.900491,30.414823"
        }
      ];
      resolve(test);
    }).then(function(chanceList) {
      dispatch({
        type: ActionTypes.UPDATE_CHANCE_LIST,
        payload: chanceList
      });
    });
  };
}

function ChanceRedux(state, action) {
  state = state || {};
  if (action.type === ActionTypes.UPDATE_CHANCE) {
    return Object.assign(state, {
      currentChance: action.payload
    });
  } else if (action.type === ActionTypes.UPDATE_CHANGE_PROP) {
    return Object.assign(state, {
      currentChance: Object.assign({}, state.currentChance, {
        [action.payload.propName]: action.payload.propValue
      })
    });
  } else if (action.type === ActionTypes.UPDATE_CHANCE_LIST) {
    return Object.assign(state, {
      chanceList: action.payload
    });
  } else if (action.type === ActionTypes.UPDATE_MAP_LOCATION) {
    return Object.assign(state, { lnglat: action.payload });
  }
  return state;
}

/************************************************ */

//当前模式，地图模式，编辑模式
var ModeEnum = {
  MAP: "map", //地图模式
  EDIT: "edit", //机会点编辑模式
  CREATE: "create" //机会点创建模式
};

function initMap(env) {
  map = new AMap.Map(mapContainerId, {
    zoom: 4,
    mapStyle: "amap://styles/ab2c0d8d125f8d8556e453149622a5a2"
  });
  var DistrictExplorer = env.DistrictExplorer;
  var $ = env.$;

  //当前的模式
  var currentMode = ModeEnum.MAP;
  var currentChance; //当前操作的机会点
  var chanceList; //当前左边的机会点列表
  var searchList; //查询结果
  var lnglat; //当前位置
  var store = Redux.createStore(
    ChanceRedux,
    Redux.applyMiddleware(window.ReduxThunk.default)
  );
  var unsubscribe = store.subscribe(function() {
    if (
      store.getState().chanceList &&
      chanceList !== store.getState().chanceList
    ) {
      chanceList = store.getState().chanceList;
      loadChanceList(store.getState().chanceList);
    }

    if (
      store.getState().currentChance &&
      currentChance !== store.getState().currentChance
    ) {
      currentChance = store.getState().currentChance;
      updateMapChance(currentChance);
      updateForm(currentChance);
    }

    if (store.getState().lnglat && lnglat !== store.getState().lnglat) {
      var lnglat = store.getState().lnglat;
      setLocationMarkerRange(new AMap.LngLat(lnglat[0], lnglat[1]));
    }
  });

  store.dispatch(queryChanceList());

  //创建一个实例
  var districtExplorer = (window.districtExplorer = new DistrictExplorer({
    eventSupport: true, //打开事件支持
    map: map
  }));

  var scale = new AMap.Scale({
    visible: true
  });

  map.addControl(scale);
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
    if (currentMode !== ModeEnum.MAP) return; //编辑模式，不响应
    toggleHoverFeature(
      feature,
      e.type === "featureMouseover",
      e.originalEvent ? e.originalEvent.lnglat : null
    );
  });

  //监听鼠标在feature上滑动
  districtExplorer.on("featureMousemove", function(e, feature) {
    if (currentMode !== ModeEnum.MAP) return; //编辑模式，不响应
    //更新提示位置
    tipMarker.setPosition(e.originalEvent.lnglat);
  });

  //feature被点击
  districtExplorer.on("featureClick", function(e, feature) {
    console.log(currentMode);
    if (currentMode !== ModeEnum.MAP) return; //编辑模式，不响应
    var props = feature.properties;
    //如果存在子节点
    //if (props.childrenNum > 0) {
    //切换聚焦区域
    switch2AreaNode(props.adcode);
    //}
  });

  //外部区域被点击
  districtExplorer.on("outsideClick", function(e) {
    if (currentMode !== ModeEnum.MAP) return; //编辑模式，不响应
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
        levelLimit: 3
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
      loadAreaData(areaNode);
      if (callback) {
        callback(null, areaNode);
      }
    });
  }

  //行政区数
  var areaTree = {};
  //全国
  switch2AreaNode(100000, function(err, areaNode) {});

  /**
   * 加载机会点列表
   */
  function loadChanceList(chanceList) {
    var container = $("#chancelistContainer").empty();
    var items = [];
    if (chanceList && chanceList.length) {
      console.log(chanceList);
      chanceList.forEach(function(chance) {
        var itemele = `<div class="chanceItem" data-json="${encodeURIComponent(
          JSON.stringify(chance)
        )}">
            <div class="chance_name">${chance.name}</div>
            <div class="chance_address">地址：${chance.address}</div>
          </div>`;
        items.push(itemele);
      });
    } else {
      var itemele = `<div class="chanceItem"><div class="chance_address">没有机会点数据</div></div>`;
      items.push(itemele);
    }
    container.append(items);
  }

  $("#province,#city,#district").on("change", function(e) {
    changeMode(ModeEnum.MAP);
    if ($(this).val()) {
      switch2AreaNode($(this).val());
    }
  });

  $("#createChanceBtn").on("click", function(e) {
    changeMode(ModeEnum.CREATE);
    map.on("click", markChance);
  });

  $("#chance_save").on("click", function(e) {
    console.log($("#chanceForm").serializeArray());
  });

  $("#chance_revoke").on("click", function(e) {});

  $("#chance_location_btn").on("click", function(e) {
    var lnglat = $("#chance_lnglat").val();
    if (lnglat) {
      var arrLngLat = lnglat.split(",");
      if (isNaN(arrLngLat[0]) || isNaN(arrLngLat[1])) {
        alert("经纬度错误");
        return;
      }
      map.panTo([arrLngLat[0], arrLngLat[1]]);
    }
  });

  /**
   * 标记机会点
   */
  function markChance(e) {
    var chance = {
      name: "",
      chanceId: "",
      id: null,
      fence: "", //围栏
      province: "", //省
      provinceName: "",
      city: "",
      cityName: "",
      district: "",
      districtName: "",
      address: "",
      lnglat: e.lnglat.getLng() + "," + e.lnglat.getLat()
    };
    store.dispatch(updateChance(chance));
    changeMode(ModeEnum.EDIT);
  }

  /**
   * 切换模式
   */
  function changeMode(changeMode) {
    currentMode = changeMode;
    if (changeMode === ModeEnum.MAP) {
      map.off("click", markChance);
    } else if (changeMode === ModeEnum.EDIT) {
      map.off("click", markChance);
    } else if (changeMode == ModeEnum.CREATE) {
      map.on("click", markChance);
    }
  }

  $("#chancelistContainer").on("click", ".chanceItem", function() {
    $(".chanceItem").removeClass("selected");
    $(this).addClass("selected");
    var json = JSON.parse(decodeURIComponent($(this).data("json")));
    store.dispatch(updateChance(json));
  });

  $("#search_btn").on("click", function() {
    changeMode(ModeEnum.MAP);
    var adcode =
      $("#district").val() || $("#city").val() || $("#province").val();
    var searchStr = $("#searchStr").val();
    if (!searchStr) {
      alert("请填写搜索关键字");
      return;
    }
    function search(adcode, searchStr, options) {
      keywordSearch(adcode, searchStr, options).then(function(result) {
        var searchList = $(".searchList").empty();
        var elements = [];
        if (
          /ok/i.test(result.info) &&
          result.poiList &&
          result.poiList.pois.length
        ) {
          result.poiList.pois.forEach(function(item, index) {
            var _ele = $(`<div class="resultItem" data-poi="${encodeURIComponent(
              JSON.stringify(item)
            )}">
               <div class="resultItem_name">${item.name}</div>
               <div class="resultItem_address">地址：${item.address ||
                 item.adname ||
                 item.cityname}</div>
             </div>`);
            elements.push(_ele);
          });
          //设置分页
          var count = result.poiList.count;
          var pageIndex = result.poiList.pageIndex;
          var pageSize = result.poiList.pageSize;
          var pagination = $(".pagination").empty();
          pagination.hide();
          if (count > pageSize) {
            pagination.show();
            var pre = $("<span>«</span>").on("click", function() {
              if (pageIndex - 1 > 0) {
                search(adcode, searchStr, {
                  pageIndex: pageIndex - 1,
                  pageSize: pageSize
                });
              }
            });
            pagination.append(pre);
            var pageCount =
              parseInt(count / pageSize) + (count % pageSize === 0 ? 0 : 1);
            if (pageIndex <= 4) {
              for (var i = 0; i < 4 && i < pageCount; i++) {
                if (i + 1 === pageIndex) {
                  pagination.append(
                    `<span data-index="${i +
                      1}" class="indicator selected">${i + 1}</span>`
                  );
                } else {
                  pagination.append(
                    `<span data-index="${i + 1}" class="indicator">${i +
                      1}</span>`
                  );
                }
              }
            } else {
              for (var i = pageIndex - 4; i < pageIndex; i++) {
                if (i + 1 === pageIndex) {
                  pagination.append(
                    `<span data-index="${i +
                      1}" class="indicator selected">${i + 1}</span>`
                  );
                } else {
                  pagination.append(
                    `<span data-index="${i + 1}" class="indicator">${i +
                      1}</span>`
                  );
                }
              }
            }
            var next = $("<span>»</span>").on("click", function() {
              search(adcode, searchStr, {
                pageIndex: pageIndex + 1,
                pageSize: pageSize
              });
            });
            pagination.append(next);
          } else {
            pagination.hide();
          }
        } else {
          var _ele = $(
            `<div class="resultItem"><div class="resultItem_address">没有匹配的数据</div></div>`
          );
          elements.push(_ele);
        }
        searchList.append(elements);
        if (elements && elements.length) {
          $(".resultItem").on("click", function() {
            var poiData = JSON.parse(decodeURIComponent($(this).data("poi")));
            $(".resultItem").removeClass("selected");
            $(this).addClass("selected");
            map.clearMap();
            //setLocationMarkerRange(poiData.location);
            store.dispatch(
              updateMapLocation(poiData.location.lng, poiData.location.lat)
            );
            map.panTo(poiData.location);
            map.setZoom(15);
          });
          $(".indicator").on("click", function() {
            search(adcode, searchStr, {
              pageIndex: $(this).data("index"),
              pageSize: pageSize
            });
          });
        }
        showSearch();
      });
    }
    search(adcode, searchStr, {});
  });

  function showSearch() {
    $(".content_left").show();
    $(".searchResultPanel").show();
    $(".chanceInfoPanel").hide();
  }

  function showChanceInfo() {
    $(".content_left").show();
    $(".searchResultPanel").hide();
    $(".chanceInfoPanel").show();
  }

  /**
   * 更新地图上的机会点
   */
  function updateMapChance(chance) {
    var strLnglat = chance.lnglat;
    var arrLnglat = strLnglat.split(",");
    var lnglat = new AMap.LngLat(arrLnglat[0], arrLnglat[1]);
    map.clearMap();
    setLocationMarkerRange(lnglat);
    setChanceMarker(chance);
    map.panTo(lnglat);
    map.setZoom(15);
  }
  /**
   * 设置经纬度的范围
   */
  function setLocationMarkerRange(location) {
    if (!location) return;
    var options = {
      strokeColor: "#F33", //线颜色
      strokeOpacity: 0.05, //线透明度
      strokeWeight: 0.05, //线粗细度
      fillColor: "#ee2200", //填充颜色
      fillOpacity: 0.05, //填充透明度
      bubble: true
    };
    //圆心
    var circle1 = new AMap.Circle(
      Object.assign(
        {
          center: new AMap.LngLat(location.lng, location.lat), // 圆心位置
          radius: 20 //半径
        },
        options
      )
    );

    //一公里
    var circle2 = new AMap.Circle(
      Object.assign(
        {
          center: new AMap.LngLat(location.lng, location.lat), // 圆心位置
          radius: 500 //半径
        },
        options
      )
    );

    //三公里
    var circle3 = new AMap.Circle(
      Object.assign(
        {
          center: new AMap.LngLat(location.lng, location.lat), // 圆心位置
          radius: 1500 //半径
        },
        options
      )
    );
    map.add(circle1);
    map.add(circle2);
    map.add(circle3);
  }

  /**
   *  设置机会点marker
   */
  function setChanceMarker(chance) {
    var lnglatStr = chance.lnglat;
    var arrLnglat = lnglatStr.split(",");
    var marker = new AMap.Marker({
      position: arrLnglat,
      offset: new AMap.Pixel(-13, -30),
      draggable: chance.id ? false : true,
      cursor: chance.id ? "pointer" : "move"
    });
    marker.setMap(map);
    if (!chance.id) {
      //如果已经创建，则不能修改位置信息
      marker.on("dragstart", function() {
        console.log("dragstart");
      });
      marker.on("dragging", function() {
        console.log("dragging");
      });
      marker.on("dragend", function(e) {
        //setForm(marker);
        var lng = marker.getPosition().lng;
        var lat = marker.getPosition().lat;
        store.dispatch(updateChanceProp("lnglat", lng + "," + lat));
      });
    }
  }

  /**
   * 更新form表单
   */
  function updateForm(chance) {
    showChanceInfo();
    var lnglatStr = chance.lnglat;
    var arrLnglat = lnglatStr.split(",");
    var adcode =
      $("#district").val() || $("#city").val() || $("#province").val();
    var geocoder = new AMap.Geocoder({
      city: adcode
    });
    var lng = arrLnglat[0];
    var lat = arrLnglat[1];
    $("#chance_lnglat").val(lng + "," + lat);
    if (chance.id) {
      $("#chance_lnglat").attr("readonly", true);
    }
    $("#chance_id").val(chance.id);
    $("#chance_name").val(chance.name);
    $("#chance_address").val(chance.address);
    $("#chance_fence").val(chance.fence);
    geocoder.getAddress([lng, lat], function(status, result) {
      if (status === "complete" && result.info === "OK") {
        var address = result.regeocode.formattedAddress; //返回地址描述
        $("#chance_refaddress").html("参考地址：" + address);
      }
    });
    if (chance.id) {
      $("#chance_revoke").hide();
      $("#chance_save").hide();
      $("#chance_update").show();
      $("#chance_fence").hide();
    } else {
      $("#chance_revoke").show();
      $("#chance_save").show();
      $("#chance_update").hide();
      $("#chance_fence").show();
    }
  }

  function loadAreaData(areaNode) {
    var adcode = areaNode.getAdcode();
    var areaProps = areaNode.getProps();
    var subFeatures = areaNode.getSubFeatures();
    if (!areaTree[adcode]) {
      areaTree[adcode] = areaProps;
    }
    var electEle;
    if (areaProps.level === "country") {
      electEle = $("#province").empty();
      electEle.append("<option value=''>请选择</option>");
      $("#city").empty();
      $("#district").empty();
    } else if (areaProps.level === "province") {
      electEle = $("#city").empty();
      electEle.append("<option value=''>请选择</option>");
      $("#district").empty();
    } else if (areaProps.level === "city") {
      electEle = $("#district").empty();
      electEle.append("<option value=''>请选择</option>");
    }
    if (subFeatures && subFeatures.length) {
      var childAdcodes = [];
      for (var i = 0; i < subFeatures.length; i++) {
        childAdcodes.push(subFeatures[i].properties.adcode);
        var _childProps = subFeatures[i].properties;
        if (!areaTree[_childProps.adcode]) {
          areaTree[_childProps.adcode] = _childProps;
        }
        var option = $("<option>")
          .text(_childProps.name)
          .val(_childProps.adcode);
        electEle.append(option);
      }
      areaTree[adcode].children = childAdcodes;
    }
    if (areaProps.level === "province") {
      $("#province")
        .find("option:selected")
        .prop("selected", false);
      $("#province option[value='" + areaProps.adcode + "']").prop(
        "selected",
        true
      );
    } else if (areaProps.level === "city") {
      $("#city")
        .find("option:selected")
        .prop("selected", false);
      $("#city option[value='" + areaProps.adcode + "']").prop(
        "selected",
        true
      );
    } else if (areaProps.level === "district") {
      $("#district")
        .find("option:selected")
        .prop("selected", false);
      $("#district option[value='" + areaProps.adcode + "']").prop(
        "selected",
        true
      );
    }
  }

  /**
   * POI查询
   * @param keywords 查询关键字
   * @param limitAdcode 当前区域节点
   */
  function keywordSearch(limitAdcode, keywords, options = {}) {
    console.log(keywords);
    var autoOptions = Object.assign(
      {
        pageSize: 20, //查询的分页
        extensions: "all", //返回基本+详细信息
        type:
          "汽车服务|汽车销售|汽车维修|摩托车服务|餐饮服务|购物服务|生活服务|体育休闲服务|医疗保健服务|住宿服务|风景名胜|商务住宅|政府机构及社会团体|科教文化服务|交通设施服务|金融保险服务|公司企业|道路附属设施|地名地址信息|公共设施"
      },
      options
    );
    if (limitAdcode) {
      autoOptions.city = limitAdcode;
      autoOptions.citylimit = true;
    }
    var placeSearch = new AMap.PlaceSearch(autoOptions);
    return new Promise(function(resolve, reject) {
      placeSearch.search(keywords, function(status, result) {
        if (status === "error") {
          return reject(result);
        }
        return resolve(result);
      });
    });
  }

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
