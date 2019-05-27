function DataAnalysis(chancePoint) {
  var estimateResults = chancePoint.estimateResults;
  var analysisors = [];

  function initDialog() {
    $("#analysisDialog #analysisTitle").html(
      "机会点<" + chancePoint.name + ">评估分析"
    );
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
      if (quotas && quotas.length) {
        quotas.forEach(function(quota, index) {
          var tr = $("<tr></tr>");
          if (index === 0) {
            tr.append(etd);
          }
          var analysisor = ruleEngineFactory(
            estimateResults,
            quota.ruleName,
            quota,
            function() {
              validWeight(analysisors);
            }
          );
          tr.append(analysisor.render());
          trs.push(tr);
          analysisors.push(analysisor);
        });
      }
    });
    $("#analysisTable tbody")
      .empty()
      .append(trs);

    $("#resetAnalysis").on("click", resetAnalysis);
  }

  //保存分析
  function saveAnalysis() {
    serviceApi.saveAnalysis(chancePoint, estimateResults).then(function() {});
  }

  //进入模型调整模式
  function editMode() {
    if (analysisors && analysisors.length) {
      analysisors.forEach(function(analysisor) {
        analysisor.setMode("edit");
      });
    }
  }

  //进入报告模式
  function reportMode() {
    if (analysisors && analysisors.length) {
      analysisors.forEach(function(analysisor) {
        analysisor.setMode("report");
      });
    }
  }

  //重置分析
  function resetAnalysis() {
    estimateResults.forEach(function(estimateResult) {
      var quotas = estimateResult.quotas;
      if (quotas && quotas.length) {
        quotas.forEach(function(quota, index) {
          quota.weight = 0;
          quota.weightScore = 0;
          quota.baseValue = null;
        });
      }
    });
    initDialog();
  }

  //显示信息
  function validWeight() {
    var weight = 0;
    var weightScore = 0;
    estimateResults.forEach(function(estimateResult) {
      var quotas = estimateResult.quotas;
      if (quotas && quotas.length) {
        quotas.forEach(function(quota, index) {
          weight += parseFloat(quota.weight);
          weightScore += parseFloat(quota.weightScore);
        });
      }
    });
    var info = "";
    if (weight !== 100) {
      info =
        "权重总计：<span style='color:red'>" +
        weight +
        "%</span><span>权重得分总计：" +
        weightScore +
        "</span>";
    } else {
      info =
        "<span style='color:red'>权重总计：" +
        weight +
        "%</span><span>权重得分总计：" +
        weightScore +
        "</span>";
    }
    $("#analysisInfo").html(info);

    $("#saveAnalysis").off("click", saveAnalysis);
    if (weight === 100) {
      $("#saveAnalysis").removeClass("disabled");
      $("#saveAnalysis").on("click", saveAnalysis);
    } else {
      $("#saveAnalysis").addClass("disabled");
    }
  }

  function show() {
    $("#analysisDialog").modal({
      show: true,
      keyboard: false,
      backdrop: false
    });
  }

  initDialog();
  show();
}
