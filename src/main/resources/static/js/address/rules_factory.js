var ruleEngineFactory = function(
  estimateResults,
  ruleName,
  quotaData,
  onchange
) {
  var ruleEngins = {
    //商圈人口体量
    circlePopulation: function(callback) {
      function getScore(baseValue) {
        if (baseValue >= 1000000) {
          return 100;
        } else if (baseValue >= 800000) {
          return 80;
        } else if (baseValue >= 400000) {
          return 60;
        } else if (baseValue >= 200000) {
          return 40;
        } else {
          return 0;
        }
      }

      function getBaseValue(data) {
        var values = data.values;
        var baseValue = 0;
        if (values && values.length) {
          for (let index = 0; index < values.length; index++) {
            var element = values[index];
            if (element.label === "人口总量") {
              baseValue = element.value;
              break;
            }
          }
        }
        return baseValue;
      }

      callback(getBaseValue, getScore);
    },

    //商圈活跃度
    circleActive: function(callback) {
      function getScore(baseValue) {
        if (baseValue >= 20) {
          return 100;
        } else if (baseValue >= 10) {
          return 80;
        } else if (baseValue >= 5) {
          return 60;
        } else if (baseValue >= 1) {
          return 40;
        } else {
          return 0;
        }
      }

      function getBaseValue(data) {
        var values = data.values;
        var baseValue = 0;
        if (values && values.length) {
          for (let index = 0; index < values.length; index++) {
            var element = values[index];
            baseValue += parseFloat(element.value);
          }
        }
        return baseValue;
      }
      callback(getBaseValue, getScore);
    },

    //商圈形成年限
    circleCreateYear: function(callback) {
      function getScore(baseValue) {
        if (baseValue >= 5) {
          return 100;
        } else if (baseValue >= 4) {
          return 80;
        } else if (baseValue >= 3) {
          return 60;
        } else if (baseValue >= 2) {
          return 40;
        } else {
          return 0;
        }
      }
      callback(function() {
        return 0;
      }, getScore);
    },

    //商圈发展趋势 TODO 需要返回枚举值
    circleDevelopingTrend: function(callback) {
      function getBaseValue(data) {
        var values = data.values;
        var baseValue = 0;
        if (values && values.length) {
          return values[0].value ? parseFloat(values[0]).value : 0;
        }
        return baseValue;
      }

      function getScore(baseValue) {
        if (baseValue === 1) {
          return 100;
        } else if (baseValue === 2) {
          return 80;
        } else if (baseValue >= 3) {
          return 60;
        } else {
          return 0;
        }
      }

      function getSelectValues() {
        return [
          { label: "成熟型", value: 1 },
          { label: "成长型", value: 2 },
          { label: "规划型", value: 3 },
          { label: "未规划", value: 0 }
        ];
      }

      callback(getBaseValue, getScore, getSelectValues);
    },

    //商区人口体量
    districtPopulation: function(callback) {
      function getScore(baseValue) {
        if (baseValue >= 500000) {
          return 100;
        } else if (baseValue >= 400000) {
          return 80;
        } else if (baseValue >= 200000) {
          return 60;
        } else if (baseValue >= 100000) {
          return 40;
        } else {
          return 0;
        }
      }
      function getBaseValue(data) {
        var values = data.values;
        var baseValue = 0;
        if (values && values.length) {
          for (let index = 0; index < values.length; index++) {
            var element = values[index];
            if (element.label === "人口总量") {
              baseValue = element.value;
              break;
            }
          }
        }
        return baseValue;
      }
      callback(getBaseValue, getScore);
    },

    //政府规划3年内小区人口体量
    districtPopulationIn3Year: function(callback) {
      function getBaseValue(data) {
        return 0;
      }
      function getScore(baseValue) {
        if (baseValue >= 500000) {
          return 100;
        } else if (baseValue >= 400000) {
          return 80;
        } else if (baseValue >= 200000) {
          return 60;
        } else if (baseValue >= 100000) {
          return 40;
        } else {
          return 0;
        }
      }
      callback(getBaseValue, getScore);
    },

    //商区当前人口活跃度-入住率（%）
    districtPopulationActive: function(callback) {
      function getBaseValue(data) {
        return 0;
      }
      function getScore(baseValue) {
        if (baseValue >= 50) {
          return 100;
        } else if (baseValue >= 40) {
          return 80;
        } else if (baseValue >= 20) {
          return 60;
        } else if (baseValue >= 10) {
          return 40;
        } else {
          return 0;
        }
      }
      callback(getBaseValue, getScore);
    },

    //商区消费者活跃度
    districtCustomerActive: function(callback) {
      function getBaseValue(data) {
        var values = data.values;
        var baseValue = 0;
        if (values && values.length) {
          for (let index = 0; index < values.length; index++) {
            const element = values[index];
            if ("<19" !== element.label) {
              baseValue += parseFloat(element.value);
              break;
            }
          }
        }
        return baseValue;
      }
      function getScore(baseValue) {
        if (baseValue >= 50) {
          return 100;
        } else if (baseValue >= 40) {
          return 80;
        } else if (baseValue >= 20) {
          return 60;
        } else if (baseValue >= 10) {
          return 40;
        } else {
          return 0;
        }
      }
      callback(getBaseValue, getScore);
    },

    //商区消费者有子女占比,TODO 取有还是无？
    districtCustomerChildrenProportion: function(callback) {
      function getBaseValue(data) {
        var values = data.values;
        var baseValue = 0;
        if (values && values.length) {
          for (let index = 0; index < values.length; index++) {
            const element = values[index];
            if ("有" === element.label) {
              baseValue += parseFloat(element.value);
              break;
            }
          }
        }
        return baseValue;
      }

      function getScore(baseValue) {
        if (baseValue >= 50) {
          return 100;
        } else if (baseValue >= 40) {
          return 80;
        } else if (baseValue >= 20) {
          return 60;
        } else if (baseValue >= 10) {
          return 40;
        } else {
          return 0;
        }
      }
      callback(getBaseValue, getScore);
    },

    //商区活跃度
    districtActive: function(callback) {
      function getBaseValue(data) {
        var values = data.values;
        var baseValue = 0;
        if (values && values.length) {
          for (let index = 0; index < values.length; index++) {
            const element = values[index];
            baseValue += parseFloat(element.value);
          }
        }
        return baseValue;
      }

      function getScore(baseValue) {
        if (baseValue >= 15) {
          return 100;
        } else if (baseValue >= 10) {
          return 80;
        } else if (baseValue >= 5) {
          return 60;
        } else if (baseValue >= 1) {
          return 40;
        } else {
          return 0;
        }
      }
      callback(getBaseValue, getScore);
    },

    //商区关键配套
    districtMating: function(callback) {
      function getBaseValue(data) {
        var values = data.values;
        var baseValue = 0;
        if (values && values.length) {
          for (let index = 0; index < values.length; index++) {
            const element = values[index];
            baseValue += parseFloat(element.value);
          }
        }
        return baseValue;
      }

      function getScore(baseValue) {
        if (baseValue >= 30) {
          return 100;
        } else if (baseValue >= 20) {
          return 80;
        } else if (baseValue >= 10) {
          return 60;
        } else if (baseValue >= 5) {
          return 40;
        } else {
          return 0;
        }
      }
      callback(getBaseValue, getScore);
    },

    //商区定位 TODO 需要显示枚举
    districtLevel: function(callback) {
      function getBaseValue(data) {
        var values = data.values;
        var baseValue = 0;
        if (values && values.length) {
          return values[0].value ? parseInt(values[0].value) : 0;
        }
        return baseValue;
      }

      function getScore(baseValue) {
        if (baseValue === 1) {
          return 100;
        } else if (baseValue === 2) {
          return 80;
        } else if (baseValue === 3) {
          return 60;
        } else {
          return 0;
        }
      }

      function getSelectValues() {
        return [
          { label: "核心商区", value: 1 },
          { label: "次核心商区", value: 2 },
          { label: "规划型商区", value: 3 },
          { label: "未规划商区", value: 0 }
        ];
      }

      callback(getBaseValue, getScore, getSelectValues);
    },

    //商区公交路线数量
    districtBusLineNum: function(callback) {
      function getBaseValue(data) {
        var values = data.values;
        var baseValue = 0;
        if (values && values.length) {
          return values[0].value ? parseInt(values[0].value) : 0;
        }
        return baseValue;
      }

      function getScore(baseValue) {
        if (baseValue >= 20) {
          return 100;
        } else if (baseValue >= 10) {
          return 80;
        } else if (baseValue >= 5) {
          return 60;
        } else {
          return 0;
        }
      }
      callback(getBaseValue, getScore);
    },

    //商区公交站点数量
    districtBusStopNum: function(callback) {
      function getBaseValue(data) {
        var values = data.values;
        var baseValue = 0;
        if (values && values.length) {
          return values[0].value ? parseInt(values[0].value) : 0;
        }
        return baseValue;
      }

      function getScore(baseValue) {
        if (baseValue >= 20) {
          return 100;
        } else if (baseValue >= 10) {
          return 80;
        } else if (baseValue >= 5) {
          return 60;
        } else {
          return 0;
        }
      }
      callback(getBaseValue, getScore);
    },

    //落位街道主路口客流
    districtMainRoadRate: function(callback) {
      function getBaseValue(data) {
        return 0;
      }

      function getScore(baseValue) {
        if (baseValue >= 5000) {
          return 100;
        } else if (baseValue >= 4000) {
          return 80;
        } else if (baseValue >= 2000) {
          return 60;
        } else if (baseValue >= 1000) {
          return 40;
        } else {
          return 0;
        }
      }
      callback(getBaseValue, getScore);
    },

    //街道关键配套
    streetMating: function(callback) {
      function getBaseValue(data) {
        var values = data.values;
        var baseValue = 0;
        if (values && values.length) {
          for (let index = 0; index < values.length; index++) {
            const element = values[index];
            var value = element.value;
            if (Array.isArray(value)) {
              value.forEach(v => {
                baseValue += v.value ? parseInt(v.value) : 0;
              });
            } else {
              baseValue += element.value ? parseInt(element.value) : 0;
            }
          }
        }
        return baseValue;
      }

      function getScore(baseValue) {
        if (baseValue >= 10) {
          return 100;
        } else if (baseValue >= 6) {
          return 80;
        } else if (baseValue >= 4) {
          return 60;
        } else if (baseValue >= 1) {
          return 40;
        } else {
          return 0;
        }
      }
      callback(getBaseValue, getScore);
    },

    //席位日均客流
    seatDayPersonFlow: function(callback) {
      function getBaseValue(data) {
        return 0;
      }

      function getScore(baseValue) {
        if (baseValue >= 2000) {
          return 100;
        } else if (baseValue >= 1500) {
          return 80;
        } else if (baseValue >= 1000) {
          return 60;
        } else if (baseValue >= 500) {
          return 40;
        } else {
          return 0;
        }
      }
      callback(getBaseValue, getScore);
    },

    //落位位置-是否人流同侧  TODO 加枚举值
    seatPositionFlow: function(callback) {
      function getBaseValue(data) {
        var values = data.values;
        var baseValue = 0;
        if (values && values.length) {
          return values[0].value ? parseInt(values[0].value) : 0;
        }
        return baseValue;
      }

      function getScore(baseValue) {
        if (baseValue === 1) {
          return 100;
        } else {
          return 0;
        }
      }

      function getSelectValues() {
        return [{ label: "是", value: 1 }, { label: "否", value: 0 }];
      }

      callback(getBaseValue, getScore, getSelectValues);
    },

    //落位位置-主路口距离 TODO  加枚举值
    seatPositionDistance: function(callback) {
      function getBaseValue(data) {
        var values = data.values;
        var baseValue = 0;
        if (values && values.length) {
          return values[0].value ? parseInt(values[0].value) : 0;
        }
        return baseValue;
      }
      function getScore(baseValue) {
        if (baseValue === 1) {
          return 100;
        } else if (baseValue === 2) {
          return 80;
        } else {
          return 0;
        }
      }
      function getSelectValues() {
        return [
          { label: "均小于50m", value: 1 },
          { label: "单侧小于50m", value: 2 },
          { label: "均大于100m", value: 0 }
        ];
      }
      callback(getBaseValue, getScore, getSelectValues);
    },

    //门头长度
    seatDoorheaderLen: function(callback) {
      function getBaseValue(data) {
        var values = data.values;
        var baseValue = 0;
        if (values && values.length) {
          return values[0].value ? parseInt(values[0].value) : 0;
        }
        return baseValue;
      }
      function getScore(baseValue) {
        if (baseValue >= 5) {
          return 100;
        } else if (baseValue >= 4) {
          return 80;
        } else if (baseValue >= 2) {
          return 60;
        } else {
          return 0;
        }
      }
      callback(getBaseValue, getScore);
    },

    //签约年限
    seatLeaseTerm: function(callback) {
      function getBaseValue(data) {
        return 0;
      }
      function getScore(baseValue) {
        if (baseValue >= 5) {
          return 100;
        } else if (baseValue >= 4) {
          return 80;
        } else if (baseValue >= 2) {
          return 60;
        } else {
          return 0;
        }
      }
      callback(getBaseValue, getScore);
    },

    //竞品店数量
    competitorNum: function(callback) {
      function getBaseValue(data) {
        return 0;
      }
      function getScoreDescr(data) {
        return "";
      }
      function getScore(baseValue) {
        if (baseValue >= 20) {
          return 0;
        } else if (baseValue >= 10) {
          return 60;
        } else if (baseValue >= 5) {
          return 80;
        } else {
          return 100;
        }
      }
      callback(getBaseValue, getScore, getScoreDescr);
    },

    //最近竞品距离
    competitorDistance: function(callback) {
      function getBaseValue(data) {
        return 0;
      }
      function getScore(baseValue) {
        if (baseValue >= 1000) {
          return 100;
        } else if (baseValue >= 500) {
          return 80;
        } else if (baseValue >= 300) {
          return 60;
        } else {
          return 0;
        }
      }
      callback(getBaseValue, getScore);
    },

    defaultRule: function(callback) {
      callback(
        function() {
          return 0;
        },
        function() {
          return 0;
        }
      );
    }
  };

  /**
   * @param estimateResults{Array} 评估数据集
   * @param quotaData{Object}  quota 数据
   * @param calculate{function}
   * @param baseValueChange{function}
   */
  function template(estimateResults, quotaData, ruleCalculate) {
    var baseScoreEle, //基本得分
      baseValueEle, //基础值
      weightEle, //权重
      remarkEle, //备注
      quotaLabelEle, //指标名称
      weightScoreEle, //加权得分
      mode = "edit", //默认编辑模式
      baseValueContainerEle;

    //更新数据
    function resetValue(calculateValue) {
      Object.assign(quotaData, calculateValue);
      baseValueEle.find("input").val(quotaData.baseValue);
      baseScoreEle.html(quotaData.baseScore);
      weightScoreEle.html(quotaData.weightScore);
      weightEle.find("input").val(quotaData.weight);
    }

    //设置展示模式
    function setModel(_mode) {
      mode = mode;
    }

    function innercalculate() {
      ruleCalculate(function(getBaseValue, getScore, getReferValues) {
        var baseValue = quotaData.baseValue;
        if (typeof baseValue === "undefined" || baseValue == null) {
          baseValue = getBaseValue(quotaData);
        }
        var baseScore = getScore(parseFloat(baseValue));
        var weightScore = 0;
        if (quotaData.weight) {
          weightScore = (baseScore * (quotaData.weight / 100)).toFixed(2);
        }
        var ret = {
          weight: quotaData.weight, //权重
          weightScore: weightScore, //加权得分
          baseValue: baseValue, //基础数据
          baseScore: baseScore //给予基础数据的得分
        };
        resetValue(ret);
        if (onchange) {
          onchange();
        }
      });
    }

    function init() {
      ruleCalculate(function(
        getBaseValue,
        getScore,
        getSelectValues,
        getBaseDetail
      ) {
        var selectValues = getSelectValues ? getSelectValues() : null; //得到参考值
        var baseValue = quotaData.baseValue || getBaseValue(quotaData);
        baseScoreEle = $("<td style='padding-left:10px'></td>");
        weightScoreEle = $("<td style='padding-left:10px'></td>");
        if (selectValues && selectValues.length) {
          baseValueEle = $(
            "<select class='form-control' style='width:100%'></select>"
          );
          for (let index = 0; index < selectValues.length; index++) {
            const element = selectValues[index];
            baseValueEle.append(
              "<option value='" +
                element.value +
                "'" +
                (element.value === baseValue ? "selected" : "") +
                ">" +
                element.label +
                "</option>"
            );
          }
          baseValueEle.on("change", function() {
            quotaData.baseValue = $(this).val();
            innercalculate();
          });
        } else {
          baseValueEle = $(
            "<input class='form-control' style='width:100%' value='' />"
          );
          baseValueEle.val(baseValue);
          baseValueEle.on("keyup", function() {
            quotaData.baseValue = $(this).val();
            innercalculate();
          });
        }
        baseValueContainerEle = $("<td style='width:90px;'></td>");
        baseValueContainerEle.append(baseValueEle);

        weightEle = $(
          "<td style='width:90px'><input class='input-mini form-control' style='width:100%' value=''/></td>"
        );
        remarkEle = $("<td>" + quotaData.remark + "</td>");
        quotaLabelEle = $("<td>" + quotaData.label + "</td>");
        weightEle.on("keyup", "input", function() {
          quotaData.weight = $(this).val();
          innercalculate();
        });
        innercalculate();
      });
    }
    init();
    return {
      render: function() {
        return [
          quotaLabelEle,
          weightEle,
          remarkEle,
          baseValueContainerEle,
          baseScoreEle,
          weightScoreEle
        ];
      },

      getWeight: function() {
        return quotaData.weight ? parseFloat(quotaData.weight) : 0;
      },

      getWeightScore: function() {
        return quotaData.weightScore ? parseFloat(quotaData.weightScore) : 0;
      },

      setMode: function(mode) {
        setModel(mode);
      }
    };
  }
  return template(
    estimateResults,
    quotaData,
    ruleEngins[ruleName] ? ruleEngins[ruleName] : ruleEngins["defaultRule"],
    onchange
  );
};
