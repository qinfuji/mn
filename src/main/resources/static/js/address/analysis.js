function DataAnalysis(chancePoint) {
  var estimateResults = chancePoint.estimateResults;
  var analysisors = [];

  function initDialog(mode) {
    $("#analysisDialog #analysisTitle").html(
      "机会点<" + chancePoint.name + ">评估分析"
    );
    if (!estimateResults) return;
    var trs = [];

    estimateResults.forEach(function(estimateResult, estimateIndex) {
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
            mode,
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

    var operationBar = $("#operationBar").empty();

    var analysisInfo = $('<div id="analysisInfo"></div>');

    var saveBtn = $(
      '<button type="button" class="btn btn-primary" id="saveAnalysis">保存</button>'
    );

    var editBtn = $(
      '<button type="button" class="btn btn-primary" id="editAnalysis">模型调整</button>'
    );

    var reportBtn = $(
      '<button type="button" class="btn btn-primary" id="reportAnalysis">结果模拟</button>'
    );

    if (mode === "edit") {
      editBtn.hide();
    } else {
      reportBtn.hide();
    }

    operationBar.append(analysisInfo);
    operationBar.append(saveBtn);
    operationBar.append(editBtn);
    operationBar.append(reportBtn);

    saveBtn.on("click", function() {
      serviceApi.saveAnalysis(chancePoint, estimateResults).then(function() {
        alert("保存成功！");
      });
    });
    editBtn.on("click", function() {
      initDialog("edit");
    });
    reportBtn.on("click", function() {
      initDialog("report");
    });
    validWeight();
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

    if (weight === 100) {
      $("#saveAnalysis").removeClass("disabled");
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

  initDialog("edit");
  show();
}
