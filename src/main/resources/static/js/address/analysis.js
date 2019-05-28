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

    var exportBtn = $(
      '<button type="button" class="btn btn-primary" id="exportAnalysis">导出Excel</button>'
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

    if (mode === "report") {
      operationBar.append(exportBtn);
      exportBtn.on("click", function() {
        var ExportButtons = document.getElementById("analysisTable");
        var instance = new TableExport(ExportButtons, {
          formats: ["xls"],
          exportButtons: false
        });
        var exportData = instance.getExportData()["analysisTable"]["xls"];
        instance.export2file(
          exportData.data,
          exportData.mimeType,
          "结果模拟",
          exportData.fileExtension
        );
      });
    }

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
        "权重总计：<span>" +
        weight +
        "%</span><span>权重得分总计：" +
        weightScore +
        "</span>";
    }
    $("#analysisInfo").html(info);
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
