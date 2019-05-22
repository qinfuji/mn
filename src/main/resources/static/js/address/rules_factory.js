var ruleEngineFactory = function(ruleName, data) {
  var ruleEngins = {
    //商圈人口体谅
    circlePopulation: function(data) {
      var html, resultEle, baseValueEle, weightEle, remarkEle, quotaLabelEle;
      function init() {
        resultEle = $("<td><td>");
        baseValueEle = $(
          "<td style='width:75px'><input style='width:75px'  value=''/></td>"
        );
        weightEle = $(
          "<td style='width:65px'><input style='width:65px' value=''/></td>"
        );
        remarkEle = $("<td>" + data.remark + "</td>");
        quotaLabelEle = $("<td>" + data.label + "</td>");

        weightEle.on("keyup", "input", function() {
          console.log("===>", $(this).val());
        });

        var quotaItems = data.values;
        if (quotaItems && quotaItems.length) {
          var baseValue = 0;
          for (let index = 0; index < quotaItems.length; index++) {
            const element = quotaItems[index];
            if (element.label === "人口总量") {
              baseValue = element.value;
              baseValueEle.find("input").val(baseValue);
            }
          }
        }

        baseValueEle.on("keyup", "input", function() {
          console.log("---", $(this).val());
        });
      }
      init();
      return {
        render: function() {
          return [quotaLabelEle, weightEle, remarkEle, baseValueEle, resultEle];
        }
      };
    },

    defaultRule: function(data) {
      var html,
        resultEle,
        baseValueEle,
        baseValueInputEle,
        weightEle,
        remarkEle,
        quotaLabelEle;
      function init() {
        resultEle = $("<td><td>");
        baseValueEle = $(
          "<td style='width:75px'><input style='width:75px'  value=''/></td>"
        );
        weightEle = $(
          "<td style='width:65px'><input style='width:65px' value=''/></td>"
        );
        remarkEle = $("<td>" + data.remark + "</td>");
        quotaLabelEle = $("<td>" + data.label + "</td>");

        baseValueEle.on("keyup", "input", function() {
          console.log("---", $(this).val());
        });
        weightEle.on("keyup", "input", function() {
          console.log("===>", $(this).val());
        });
      }
      init();
      return {
        render: function() {
          return [quotaLabelEle, weightEle, remarkEle, baseValueEle, resultEle];
        }
      };
    }
  };
  console.log("====>ruleName", ruleName, ruleEngins[ruleName]);
  return ruleEngins[ruleName]
    ? ruleEngins[ruleName](data)
    : ruleEngins["defaultRule"](data);
};
