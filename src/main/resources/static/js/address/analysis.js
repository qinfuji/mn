function DataAnalysis(chancePoint) {
  console.log(chancePoint);

  //得到数据分析起
  function getAnalysisor(ruleName, data, callback) {
    // //通过rule，得到数据分析器
    // function quotaAnalysisor(data) {
    //   var html,
    //     resultEle,
    //     baseValueEle,
    //     baseValueInputEle,
    //     weightEle,
    //     remarkEle,
    //     quotaLabelEle;
    //   function init() {
    //     resultEle = $("<td><td>");
    //     baseValueEle = $(
    //       "<td style='width:75px'><input style='width:75px'  value=''/></td>"
    //     );
    //     weightEle = $(
    //       "<td style='width:65px'><input style='width:65px' value=''/></td>"
    //     );
    //     remarkEle = $("<td>" + data.remark + "</td>");
    //     quotaLabelEle = $("<td>" + data.label + "</td>");
    //     baseValueEle.on("keyup", "input", function() {
    //       console.log("---", $(this).val());
    //     });
    //     weightEle.on("keyup", "input", function() {
    //       console.log("===>", $(this).val());
    //     });
    //   }
    //   init();
    //   return {
    //     render: function() {
    //       return [quotaLabelEle, weightEle, remarkEle, baseValueEle, resultEle];
    //     }
    //   };
    // }
    // return quotaAnalysisor(data);
    return ruleEngineFactory(ruleName, data, callback);
  }

  function initDialog() {
    $("#analysisDialog #analysisTitle").html(
      '机会点"' + chancePoint.name + '"分析'
    );

    var estimateResults = chancePoint.estimateResults;
    var trs = [];
    estimateResults.forEach(function(estimateResult, estimateIndex) {
      console.log(estimateResult);
      var quotas = estimateResult.quotas;
      var etd = $(
        "<td rowspan='" + quotas.length + "'>" + estimateResult.label + "</td>"
      );
      var analysisors = [];
      if (quotas && quotas.length) {
        quotas.forEach(function(quota, index) {
          var ruleName = quota.ruleName;
          var tr = $("<tr></tr>");
          if (index === 0) {
            tr.append(etd);
          }
          var analysisor = getAnalysisor(quota.ruleName, quota);
          tr.append(analysisor.render());
          trs.push(tr);
        });
      }
    });
    $("#analysisTable tbody")
      .empty()
      .append(trs);
  }

  function show() {
    $("#analysisDialog").modal({
      show: true,
      keyboard: false,
      backdrop: false
    });
  }

  function close() {}

  initDialog();
  show();
}
