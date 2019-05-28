var HOST = "";

function getQueryString(name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
  var r = window.location.search.substr(1).match(reg);
  if (r != null) return unescape(r[2]);
  return null;
}

function _getAuthInfo() {
  return {
    userAccount: getQueryString("userAccount"),
    token: getQueryString("token")
  };
}

var serviceApi = {
  getChanceEstimateResult: function(id) {
    var authInfo = _getAuthInfo();
    return new Promise(function(resolve, reject) {
      $.ajax({
        url:
          HOST +
          "/api/chance/" +
          id +
          "/estimates?userAccount=" +
          authInfo.userAccount,
        type: "get",
        dataType: "json",
        headers: {
          "Content-Type": "application/json;charset=utf8",
          token: authInfo.token
        },
        success: function(data) {
          if (data.code === 0) {
            resolve(data.data);
          } else {
            alert(data.msg);
            reject();
          }
        }
      });
    });
  },

  deleteChance: function(chance) {
    var authInfo = _getAuthInfo();
    return new Promise(function(resolve, reject) {
      $.ajax({
        url:
          HOST +
          "/api/chance/delete/" +
          chance.id +
          "?userAccount=" +
          authInfo.userAccount,
        type: "delete",
        dataType: "json",
        headers: {
          "Content-Type": "application/json;charset=utf8",
          token: authInfo.token
        },
        data: JSON.stringify(chance),
        success: function(data) {
          if (data.code === 0) {
            resolve(chance);
          } else {
            alert(data.msg);
            reject();
          }
        }
      });
    });
  },

  createChance: function(chance) {
    var authInfo = _getAuthInfo();
    return new Promise(function(resolve, reject) {
      $.ajax({
        url: HOST + "/api/chance/create?userAccount=" + authInfo.userAccount,
        type: "post",
        dataType: "json",
        headers: {
          "Content-Type": "application/json;charset=utf8",
          token: authInfo.token
        },
        data: JSON.stringify(chance),
        success: function(data) {
          if (data.code === 0) {
            resolve(data.data);
          } else {
            alert(data.msg);
            reject();
          }
        }
      });
    });
  },

  queryChanceList: function(scope, adcode) {
    var authInfo = _getAuthInfo();
    return new Promise(function(resolve, reject) {
      $.ajax({
        url:
          HOST +
          "/api/chance//list/" +
          scope +
          "/" +
          adcode +
          "?userAccount=" +
          authInfo.userAccount,
        type: "get",
        dataType: "json",
        headers: {
          "Content-Type": "application/json;charset=utf8",
          token: authInfo.token
        },
        success: function(data) {
          if (data.code === 0) {
            resolve(data.data.records);
          } else {
            alert(data.msg);
            reject();
          }
        }
      });
    });
  },

  updateChance: function(chance) {
    var authInfo = _getAuthInfo();
    return new Promise(function(resolve, reject) {
      $.ajax({
        url:
          HOST +
          "/api/chance/update/" +
          chance.id +
          "?userAccount=" +
          authInfo.userAccount,
        type: "put",
        dataType: "json",
        headers: {
          "Content-Type": "application/json;charset=utf8",
          token: authInfo.token
        },
        data: JSON.stringify(chance),
        success: function(data) {
          if (data.code === 0) {
            resolve(data.data);
          } else {
            alert(data.msg);
            reject();
          }
        }
      });
    });
  },

  saveAnalysis: function(chance, analysis) {
    var authInfo = _getAuthInfo();
    return new Promise(function(resolve, reject) {
      $.ajax({
        url:
          HOST +
          "/api/chance/" +
          chance.id +
          "/analysis?userAccount=" +
          authInfo.userAccount,
        type: "put",
        dataType: "json",
        headers: {
          "Content-Type": "application/json;charset=utf8",
          token: authInfo.token
        },
        data: JSON.stringify(analysis),
        success: function(data) {
          if (data.code === 0) {
            resolve(data.data);
          } else {
            alert(data.msg);
            reject();
          }
        }
      });
    });
  }
};
