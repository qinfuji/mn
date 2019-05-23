var ruleEngineFactory = function(
  estimateResults,
  ruleName,
  quotaData,
  onerror
) {
  console.log(estimateResults, ruleName, quotaData, onerror);
  var ruleEngins = {
    //商圈人口体谅
    circlePopulation: function(data) {
      function getScore(basevalue) {
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

      var baseValue = data.baseValue;
      if (typeof baseValue === "undefined" || baseValue == null) {
        baseValue = getBaseValue(data);
      }

      var baseScore = getScore(parseFloat(baseValue));
      var weightScore = 0;
      if (data.weight) {
        weightScore = baseScore * (data.weight / 100);
      }

      return {
        weight: data.weight, //权重
        weightScore: weightScore, //加权得分
        baseValue: baseValue, //基础数据
        baseScore: baseScore //给予基础数据的得分
      };
    },

    circleActive: function(data) {
      function getScore(basevalue) {
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

      var baseValue = data.baseValue;
      if (typeof baseValue === "undefined" || baseValue == null) {
        baseValue = getBaseValue(data);
      }
      var baseScore = getScore(parseFloat(baseValue));
      var weightScore = 0;
      if (data.weight) {
        weightScore = (baseScore * (data.weight / 100)).toFixed(2);
      }

      return {
        weight: data.weight, //权重
        weightScore: weightScore, //加权得分
        baseValue: baseValue, //基础数据
        baseScore: baseScore //给予基础数据的得分
      };
    },

    circleCreateYear: function(data) {
      function getScore(basevalue) {
        if (baseValue >= 5) {
          return 100;
        } else if (baseValue >= 4) {
          return 80;
        } else if (baseValue >= 4) {
          return 60;
        } else if (baseValue >= 2) {
          return 40;
        } else {
          return 0;
        }
      }

      var baseValue = data.baseValue;
      if (typeof baseValue === "undefined" || baseValue == null) {
        baseValue = 0;
      }
      var baseScore = getScore(parseFloat(baseValue));
      var weightScore = 0;
      if (data.weight) {
        weightScore = (baseScore * (data.weight / 100)).toFixed(2);
      }

      return {
        weight: data.weight, //权重
        weightScore: weightScore, //加权得分
        baseValue: baseValue, //基础数据
        baseScore: baseScore //给予基础数据的得分
      };
    },

    defaultRule: function(data) {
      return {
        weight: data.weight, //权重
        weightScore: 1, //加权得分
        baseValue: 1, //基础数据
        baseScore: 1 //给予基础数据的得分
      };
    }
  };

  /**
   * @param estimateResults{Array} 评估数据集
   * @param quotaData{Object}  quota 数据
   * @param calculate{function}
   * @param baseValueChange{function}
   */
  function template(estimateResults, quotaData, calculate) {
    var baseScoreEle,
      baseValueEle,
      weightEle,
      remarkEle,
      quotaLabelEle,
      weightScoreEle;

    var _data = Object.assign({}, quotaData);

    function resetValue(calculateValue) {
      _data = Object.assign(_data, calculateValue);
      baseValueEle.find("input").val(_data.baseValue);
      baseScoreEle.html(_data.baseScore);
      weightScoreEle.html(_data.weightScore);
      weightEle.find("input").val(_data.weight);
    }

    function init() {
      baseScoreEle = $("<td></td>");
      weightScoreEle = $("<td></td>");
      baseValueEle = $(
        "<td style='width:75px'><input style='width:75px'  value=''/></td>"
      );
      weightEle = $(
        "<td style='width:65px'><input style='width:65px' value=''/></td>"
      );
      remarkEle = $("<td>" + _data.remark + "</td>");
      quotaLabelEle = $("<td>" + _data.label + "</td>");
      weightEle.on("keyup", "input", function() {
        _data.weight = $(this).val();
        var ret = calculate(_data);
        resetValue(ret);
      });
      var ret = calculate(_data);
      resetValue(ret);

      baseValueEle.on("keyup", "input", function() {
        _data.baseValue = $(this).val();
        var ret = calculate(_data);
        resetValue(ret);
      });
    }
    init();
    return {
      render: function() {
        return [
          quotaLabelEle,
          weightEle,
          remarkEle,
          baseValueEle,
          baseScoreEle,
          weightScoreEle
        ];
      }
    };
  }
  return template(
    estimateResults,
    quotaData,
    ruleEngins[ruleName] ? ruleEngins[ruleName] : ruleEngins["defaultRule"],
    onerror
  );
};
