function DataAnalysis(chancePoint) {
  console.log(chancePoint);

  //得到数据分析起
  function getAnalysisor(estimateResults, ruleName, data, callback) {
    return ruleEngineFactory(estimateResults, ruleName, data, callback);
  }

  function initDialog() {
    $("#analysisDialog #analysisTitle").html(
      "机会点<" + chancePoint.name + ">评估分析"
    );

    var estimateResults = chancePoint.estimateResults;
    if (!estimateResults) return;
    var trs = [];
    estimateResults.forEach(function(estimateResult, estimateIndex) {
      console.log(estimateResult);
      var quotas = estimateResult.quotas;
      var etd = $(
        "<td class='quota-label' rowspan='" +
          quotas.length +
          "'>" +
          estimateResult.label +
          "</td>"
      );
      var analysisors = [];
      if (quotas && quotas.length) {
        quotas.forEach(function(quota, index) {
          var ruleName = quota.ruleName;
          var tr = $("<tr></tr>");
          if (index === 0) {
            tr.append(etd);
          }
          var analysisor = getAnalysisor(
            estimateResults,
            quota.ruleName,
            quota
          );
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
