var _a = [
  {
    label: "商圈评估",
    quotas: [
      {
        label: "商圈人口体量",
        remark: "楼盘数据参考，按照当地人口统计年鉴计算",
        values: [
          { label: "人口总量", value: "10", id: "" },
          { label: "固定人口", value: "10" },
          { label: "流动人口", value: "10" }
        ]
      },
      {
        label: "商圈活跃度",
        remark: "商圈内商业主体、商务楼数量、社区",
        values: [
          { label: "商业主体数量", value: "10" },
          { label: "商务楼数量", value: "10" },
          { label: "社区数量", value: "10" }
        ]
      }
    ]
  },

  {
    label: "商区评估",
    quotas: [
      {
        label: "商区人口体量",
        remark: "楼盘数据参考，按照当地人口统计年鉴计算",
        values: [
          { label: "人口总量", value: "10" },
          { label: "固定人口", value: "10" },
          { label: "流动人口", value: "10" }
        ]
      },
      {
        label: "商区消费者活跃度",
        remark: "18-60岁年龄结构占比",
        values: [{ label: "全年龄段占比", value: "10" }]
      },
      {
        label: "商区消费者有子女占比",
        remark: "有无子女（数据准确度极低）",
        values: [
          { label: "有子女占比", value: "10" },
          { label: "无子女占比", value: "10" }
        ]
      },
      {
        label: "商区活跃度",
        remark: "商圈内商业主体、商务楼数量、社区",
        values: [
          { label: "商业主体数量", value: "10" },
          { label: "商务楼数量", value: "10" },
          { label: "社区数量", value: "10" }
        ]
      },
      {
        label: "商区关键配套",
        remark: "银行、房产中介、超市、便利店、高校、医院数量",
        values: [
          { label: "银行数量", value: "10" },
          { label: "房产中介数量", value: "10" },
          { label: "超市数量", value: "10" },
          { label: "便利店数量", value: "10" },
          { label: "高校数量", value: "10" },
          { label: "医院数量", value: "10" }
        ]
      },
      {
        label: "商区公交路线数量",
        remark: "方圆500m内的交通枢纽数量",
        values: [{ label: "公交线路的数量", value: "10" }]
      },
      {
        label: "商区公交站点数量",
        remark: "以500m为半径",
        values: [{ label: "公交站点的数量", value: "10" }]
      }
    ]
  },

  {
    label: "街道评估",
    quotas: [
      {
        label: "街道关键配套",
        remark: "银行、房产中介、超市、便利店数量",
        values: [
          { label: "银行数量", value: "10" },
          { label: "房产中介数量", value: "10" },
          { label: "超市数量", value: "10" },
          { label: "便利店数量", value: "10" },
          { label: "高校数量", value: "10" },
          { label: "医院数量", value: "10" }
        ]
      }
    ]
  }
];

function _getAuthInfo() {
  return {
    //userAccount: jQuery.param("userAccount"),
    //token: jQuery.param("token")
    userAccount: "hcrf0366",
    token:
      "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJoY3IwMDAwMDEiLCJpYXQiOjE1NTgzNTYxMDksImV4cCI6MTU1ODM3MDUwOX0._bj1CKYzlQ3IwHEL3vQi8EaVcaxPulmc2PaMdOCjkgZ8WzxY7p7EOPJEtZhmJ2pwcKHQ6iHcGA0XE5Yx7Ikg8w"
  };
}

var serviceApi = {
  getChanceEstimateResult: function(id) {
    var authInfo = _getAuthInfo();
    return new Promise(function(resolve, reject) {
      $.ajax({
        url:
          "http:/localhost:8086/api/chance/" +
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

  createChance: function(chance) {
    var authInfo = _getAuthInfo();
    return new Promise(function(resolve, reject) {
      $.ajax({
        url:
          "http:/localhost:8086/api/chance/create?userAccount=" +
          authInfo.userAccount,
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
          "http:/localhost:8086/api/chance//list/" +
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
          "http:/localhost:8086/api/chance/update/" +
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
  }
};
