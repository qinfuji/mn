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
  UPDATE_CHANCE: "updateChance", //更新机会点信息
  UPDATE_CHANGE_PROPS: "updateChanceProps", //更新属性
  DELETE_CHANCE: "deleteChance", //删除机会点
  ADD_CHANCE: "addChance", //添加机会点
  UPDATE_CHANCE_LIST: "updateChanceList", //更新机会点列表
  ADD_CHANCE_TO_LIST: "addChanceToList", //添加新
  UPDATE_SEARCH_LIST: "updateSearchList", //查询结果
  UPDATE_MAP_LOCATION: "updateLocation", //更新地图的位置
  UPDATE_CHANCE_ESTIMATE_RESULT: "estimateResult", //更新评估结果
  SELECTED_CHANCE: "selectedChance", //选择机会点
  REMOVE_CHANCE_FROM_LIST: "removeFromList", //移除机会点列表,
  SWITCH_CHANCE: "switchChance" //切换机会点显示
};

/**
 * 更新机会点 ， 当机会点没有评估数据， 并且没有初始化时
 *
 */
function switchChance(chance) {
  if (chance && chance.id && !chance.estimateResult) {
    return function(dispatch) {
      return new Promise(function(resolve, reject) {
        dispatch({
          type: ActionTypes.SWITCH_CHANCE,
          payload: chance
        });
        resolve();
      }).then(function() {
        //如果存在商铺id,则加载评估数据
        if (chance.shopId) {
          return new Promise(function(resolve, reject) {
            serviceApi
              .getChanceEstimateResult(chance.id)
              .then(function(result) {
                resolve(result);
              });
          })
            .then(function(result) {
              dispatch({
                type: ActionTypes.UPDATE_CHANCE_ESTIMATE_RESULT,
                payload: result
              });
            })
            .catch(function(err) {
              console.log(err);
            });
        }
      });
    };
  } else {
    return function(dispatch) {
      dispatch({
        type: ActionTypes.SWITCH_CHANCE,
        payload: chance
      });
    };
  }
}

function updateChance(chance) {
  return function(dispatch) {
    dispatch({
      type: ActionTypes.UPDATE_CHANCE,
      payload: chance
    });
  };
}

function addChancePointToList(chancePoint) {
  return function(dispatch) {
    dispatch({
      type: ActionTypes.ADD_CHANCE_TO_LIST,
      payload: chancePoint
    });
  };
}

function removeChancePointFromList(chance) {
  return function(dispatch) {
    dispatch({
      type: ActionTypes.REMOVE_CHANCE_FROM_LIST,
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
function updateChanceProps(props) {
  return function(dispatch) {
    dispatch({
      type: ActionTypes.UPDATE_CHANGE_PROPS,
      payload: props
    });
  };
}

/**
 * 查询机会点列表
 */
function queryChanceList(scope, adcode) {
  scope = scope ? scope : "cuntry";
  adcode = adcode ? adcode : "100000";

  return function(dispatch) {
    return serviceApi.queryChanceList(scope, adcode).then(function(chanceList) {
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
    //如果列表中存在，同时需要更新列表
    var list = [];
    if (state.chanceList.length) {
      state.chanceList.forEach(function(chance) {
        if (chance.id === action.payload.id) {
          list.push(action.payload);
        } else {
          list.push(chance);
        }
      });
    }
    return Object.assign(state, {
      chanceList: list,
      currentChance: action.payload
    });
  } else if (action.type === ActionTypes.SWITCH_CHANCE) {
    return Object.assign(state, {
      currentChance: action.payload
    });
  } else if (action.type === ActionTypes.UPDATE_CHANGE_PROPS) {
    return Object.assign(state, {
      currentChance: Object.assign({}, state.currentChance, action.payload)
    });
  } else if (action.type === ActionTypes.UPDATE_CHANCE_LIST) {
    return Object.assign(state, {
      chanceList: action.payload
    });
  } else if (action.type === ActionTypes.ADD_CHANCE_TO_LIST) {
    return Object.assign(state, {
      chanceList: [].concat(action.payload, state.chanceList),
      currentChance: action.payload
    });
  } else if (action.type === ActionTypes.UPDATE_MAP_LOCATION) {
    return Object.assign(state, { lnglat: action.payload });
  } else if (action.type === ActionTypes.UPDATE_CHANCE_ESTIMATE_RESULT) {
    return Object.assign(state, {
      currentChance: Object.assign({}, state.currentChance, {
        estimateResult: action.payload
      })
    });
  } else if (action.type === ActionTypes.REMOVE_CHANCE_FROM_LIST) {
    var list = [];
    if (state.chanceList.length) {
      var list = state.chanceList.filter(function(chance) {
        return chance.id !== action.payload.id;
      });
    }
    return Object.assign(state, {
      chanceList: list,
      currentChance: null
    });
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
  var currentChance = null; //当前操作的机会点
  var chanceList = []; //当前左边的机会点列表
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
      //加载机会点列表
      loadChanceList(store.getState().chanceList);
      chanceList = store.getState().chanceList;
    }

    //删除当前机会点
    if (!store.getState().currentChance && currentChance) {
      updateMapChance(store.getState().currentChance); //更新地图路的机会点
      updateForm(store.getState().currentChance); //更新表单
      currentChance = null;
      return;
    }

    //机会点发生变化
    if (
      store.getState().currentChance &&
      currentChance !== store.getState().currentChance
    ) {
      updateMapChance(store.getState().currentChance); //更新地图路的机会点
      updateForm(store.getState().currentChance); //更新表单
      updateeStimateResultLoaded(store.getState().currentChance); //更新评估数据
      currentChance = store.getState().currentChance;
      return;
    }

    //更新位置
    if (store.getState().lnglat && lnglat !== store.getState().lnglat) {
      var lnglat = store.getState().lnglat;
      setLocationMarkerRange(new AMap.LngLat(lnglat[0], lnglat[1]));
      return;
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
      store.dispatch(queryChanceList($(this).attr("id"), $(this).val()));
      switch2AreaNode($(this).val(), function() {
        //限制地图显示
        // var bounds = map.getBounds();
        // map.setLimitBounds(bounds);
      });
    }
    hideAll();
  });

  $("#createChanceBtn").on("click", function(e) {
    changeMode(ModeEnum.CREATE);
    map.on("click", markChance);
  });

  $("#chance_update").on("click", function() {
    var isOk = validChance();
    if (!isOk) return;
    serviceApi.updateChance(currentChance).then(function(data) {
      store.dispatch(updateChance(data));
    });
  });

  $("#chance_save").on("click", function(e) {
    //验证错误
    var isOk = validChance();
    if (!isOk) return;
    serviceApi.createChance(currentChance).then(function(data) {
      store.dispatch(addChancePointToList(data));
    });
  });

  function validChance(chance) {
    var chanceName = $("#chance_name").val();
    if (!chanceName) {
      $("#name_msg").show();
      $("#chance_name").addClass("invalid-feedback");
    } else {
      $("#name_msg").hide();
      $("#chance_name").removeClass("invalid-feedback");
    }
    var chanceAddress = $("#chance_address").val();
    if (!chanceAddress) {
      $("#address_msg").show();
      $("#chance_address").addClass("invalid-feedback");
    } else {
      $("#address_msg").hide();
      $("#chance_address").removeClass("invalid-feedback");
    }
    var chanceType = $("#chance_type").val();
    if (!chanceType) {
      $("#type_msg").show();
      $("#chance_type").addClass("invalid-feedback");
    } else {
      $("#type_msg").hide();
      $("#chance_type").removeClass("invalid-feedback");
    }
    if (!chanceName || !chanceAddress || !chanceType) {
      return false;
    }
    return true;
  }

  $("#chance_delete").on("click", function(e) {
    var re = confirm("您确认要删除机会点？");
    if (!re) {
      return;
    }
    serviceApi.deleteChance(currentChance).then(function(data) {
      store.dispatch(removeChancePointFromList(data));
    });
  });

  $("#chance_revoke").on("click", function(e) {
    store.dispatch(switchChance(null));
  });

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

  $("#chance_name").on("change", function() {
    store.dispatch(
      updateChanceProps({
        name: $(this).val()
      })
    );
  });

  $("#chance_type").on("change", function() {
    store.dispatch(
      updateChanceProps({
        type: $(this).val()
      })
    );
  });

  $("#chance_address").on("change", function() {
    store.dispatch(
      updateChanceProps({
        address: $(this).val()
      })
    );
  });

  /**
   * 标记机会点
   */
  function markChance(e) {
    var lnglat = new AMap.LngLat(e.lnglat.getLng(), e.lnglat.getLat());
    locatePosition(lnglat).then(function(features) {
      var chance = {
        name: "",
        chanceId: "",
        id: null,
        fence: "", //围栏
        province: features.province,
        provinceName: features.provinceName,
        city: features.city || features.district, //直辖市没有城市，使用地区占位
        cityName: features.cityName || features.districtName,
        district: features.district,
        districtName: features.districtName,
        address: "",
        lnglat: e.lnglat.getLng() + "," + e.lnglat.getLat(),
        lng: e.lnglat.getLng(),
        lat: e.lnglat.getLat()
      };

      console.log(chance);
      store.dispatch(switchChance(chance));
      changeMode(ModeEnum.EDIT);
    });
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
    store.dispatch(switchChance(json));
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

  $("#chance_analysis").on("click", function() {
    DataAnalysis(currentChance);
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

  function hideAll() {
    $(".content_left").hide();
    $(".searchResultPanel").hide();
    $(".chanceInfoPanel").hide();
  }

  /**
   * 更新地图上的机会点
   */
  function updateMapChance(chance) {
    map.clearMap();
    if (!chance) return;
    var lnglat = new AMap.LngLat(chance.lng, chance.lat);
    setLocationMarkerRange(lnglat);
    setChanceMarker(chance);
    map.panTo(lnglat);
    map.setZoom(15);
  }

  function locatePosition(lnglat) {
    return new Promise(function(resolve, reject) {
      districtExplorer.locatePosition(
        lnglat,
        function(err, features) {
          isLocating = false;
          if (err) {
            reject(err);
            return;
          }
          var ret = {};
          for (var i = 0; i < features.length; i++) {
            var p = features[i].properties;
            if (p.level === "province") {
              ret.province = p.adcode;
              ret.provinceName = p.name;
            } else if (p.level === "city") {
              ret.city = p.adcode;
              ret.cityName = p.name;
            } else if (p.level === "district") {
              ret.district = p.adcode;
              ret.districtName = p.name;
            }
          }
          resolve(ret);
        },
        {
          levelLimit: 4
        }
      );
    });
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
    var center = new AMap.LngLat(location.lng, location.lat);
    //圆心
    var circle1 = new AMap.Circle(
      Object.assign(
        {
          center: center, // 圆心位置
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
    var marker = new AMap.Marker({
      position: [chance.lng, chance.lat],
      offset: new AMap.Pixel(-13, -30),
      draggable: chance.id ? false : true,
      cursor: chance.id ? "pointer" : "move"
    });
    marker.setMap(map);
    if (!chance.id) {
      //如果已经创建，则不能修改位置信息
      marker.on("dragstart", function() {});
      marker.on("dragging", function() {});
      marker.on("dragend", function(e) {
        var lng = marker.getPosition().lng;
        var lat = marker.getPosition().lat;
        locatePosition(marker.getPosition()).then(function(result) {
          store.dispatch(
            updateChanceProps(Object.assign(result, { lng: lng, lat: lat }))
          );
        });
      });
    }
  }

  /**
   * 更新form表单
   */
  function updateForm(chance) {
    if (!chance) {
      hideAll();
      return;
    }
    showChanceInfo();

    $("#name_msg").hide();
    $("#address_msg").hide();
    $("#type_msg").hide();

    var adcode =
      $("#district").val() || $("#city").val() || $("#province").val();
    var geocoder = new AMap.Geocoder({
      city: adcode
    });
    var lng = chance.lng;
    var lat = chance.lat;
    $("#chance_lnglat").val(lng + "," + lat);
    $("#chance_lng").val(lng);
    $("#chance_lat").val(lat);
    if (chance.id) {
      $("#chance_lnglat").attr("readonly", true);
    }
    $("#chance_id").val(chance.id);
    $("#chance_name").val(chance.name);
    $("#chance_address").val(chance.address);
    $("#chance_fence").val(chance.fence);
    $("#chance_type").val(chance.type);
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
      $("#chance_delete").show();
    } else {
      $("#chance_revoke").show();
      $("#chance_save").show();
      $("#chance_update").hide();
      $("#chance_fence").show();
      $("#chance_delete").hide();
    }
    if (chance.shopId) {
      $("#chance_analysis").show();
    } else {
      $("#chance_analysis").hide();
    }
  }

  /**
   * 更新机会点的评估信息
   * @paran chance  对象
   */
  function updateeStimateResultLoaded(chance, topNavIndex, childIndex) {
    if (!chance.id) {
      $(".estimateResult").empty();
      return;
    }
    if (!chance.shopId) {
      $(".estimateResult").html("<span class='message'>机会点审核中！</span>");
      return;
    }
    if (!chance.estimateResult) {
      $(".estimateResult").html(
        "<span class='message'>评估数据加载中...</span>"
      );
      return;
    }
    var navIndex = topNavIndex || 0;
    var vtabsIndex = childIndex || 0;
    var estimateResultEle = $(".estimateResult").empty();
    var nav = $('<div class="nav"></div>');
    var estimateResult = chance.estimateResult;
    //受限建立导航
    if (estimateResult && estimateResult.length) {
      estimateResult.forEach(function(estimate, index) {
        if (index === navIndex) {
          nav.append(
            "<span class='selected' data-index='" +
              index +
              "'>" +
              estimate.label +
              "</span>"
          );
        } else {
          nav.append(
            "<span data-index='" + index + "'>" + estimate.label + "</span>"
          );
        }
      });
    }

    nav.on("click", "span", function() {
      var i = $(this).data("index");
      updateeStimateResultLoaded(chance, i, 0);
    });

    var estimateResultDataEle = $("<div class='estimateResultData'></div>");
    var estimatequotaDatas = estimateResult[navIndex].quotas;
    //构造左边tab

    var vtabs = $('<div class="vtabs"></div>');
    var preIndex = 1;
    var currentIndex = 50;
    var nextInde = 49;
    estimatequotaDatas.forEach(function(estimatequota, index) {
      var _zindex = 1;
      if (vtabsIndex > index) {
        _zindex = preIndex++;
      } else if (vtabsIndex < index) {
        _zindex = nextInde--;
      } else {
        _zindex = currentIndex;
      }

      var _tab = $(
        "<div title='" +
          estimatequota.label +
          "' style='z-index:" +
          _zindex +
          ";top:" +
          index * 30 +
          "px' class='" +
          (vtabsIndex === index ? "selected" : "") +
          "' data-index='" +
          index +
          "'>" +
          estimatequota.label +
          "</div>"
      );

      vtabs.append(_tab);
    });

    vtabs.on("click", "div", function() {
      var i = $(this).data("index");
      updateeStimateResultLoaded(chance, navIndex, i);
    });

    var data = estimatequotaDatas[vtabsIndex];
    //构造form
    var datapanel = $("<div class='datapanel'></div>");
    //增加备注
    datapanel.append("<div class='remark'>" + (data.remark || "") + "</div>");
    //增加具体指标数据
    var datatable = $(
      "<table class='table table-hover table-sm table-bordered'></table>"
    );
    var tbody = $("<tbody></tbody>");
    if (data.values && data.values.length) {
      data.values.forEach(function(d, index) {
        tbody.append(
          "<tr><td>" +
            (d.label || "") +
            "</td><td>" +
            (renderValue(d.value) || "") +
            "</td></tr>"
        );
      });
    } else {
      tbody.append(
        "<tr><td style='text-align:center'>暂时无相关数据</td></tr>"
      );
    }
    datatable.append(tbody);
    datapanel.append(datatable);
    /*
    datapanel.append(
      "<div class='operation'><button class='btn btn-primary'>修改</button></div>"
    );
    */
    estimateResultDataEle.append(vtabs);
    estimateResultDataEle.append(datapanel);
    estimateResultEle.append(nav);
    estimateResultEle.append(estimateResultDataEle);
  }

  function renderValue(value) {
    if (Array.isArray(value)) {
      var ret = "";
      value.forEach(function(v) {
        ret += "<div><span>" + v.label + ":" + v.value + "</span><div>";
      });
      return ret;
    } else {
      return value || "";
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
        pageSize: 12, //查询的分页
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
