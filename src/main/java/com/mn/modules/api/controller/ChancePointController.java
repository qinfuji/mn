package com.mn.modules.api.controller;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.mn.common.validator.ValidatorUtils;
import com.mn.common.validator.group.AddGroup;
import com.mn.common.validator.group.UpdateGroup;
import com.mn.modules.api.annotation.CheckToken;
import com.mn.modules.api.entity.AnalysisResult;
import com.mn.modules.api.entity.ChancePoint;
import com.mn.modules.api.service.ChancePointService;
import com.mn.modules.api.vo.EstimateResult;
import com.mn.modules.api.vo.RestResult;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("/api/chance")
@Api("机会点管理")
public class ChancePointController {

    @Autowired
    ChancePointService service;

    @PostMapping("/create")
    @ApiOperation("创建机会点")
    @CheckToken
    public RestResult<ChancePoint> create(@RequestBody ChancePoint chancePoint,
                                          @RequestAttribute String appId) {
        chancePoint.setAppId(appId);
        ValidatorUtils.validateEntity(chancePoint, AddGroup.class);
        ChancePoint ret = service.createChancePoint(chancePoint);
        return RestResult.build(ret);
    }

    @PutMapping("/update/{id}")
    @ApiOperation("创建机会点")
    @CheckToken
    public RestResult<ChancePoint> update(@PathVariable String id,
                                          @RequestBody ChancePoint chancePoint,
                                          @RequestAttribute String appId) {

        if (!appId.equals(chancePoint.getAppId())) {
            return RestResult.fail.msg("您无权操作该数据");
        }
        ValidatorUtils.validateEntity(chancePoint, UpdateGroup.class);
        ChancePoint ret = service.updateChancePoint(chancePoint);
        return RestResult.build(ret);
    }

    @PostMapping("/delete/{id}")
    @ApiOperation("创建机会点")
    @CheckToken
    public Boolean delete(String id) {
        return true;
    }


    @GetMapping("/list/{scope}/{adcode}")
    @ApiOperation("查询机会点")
    @CheckToken
    public RestResult<IPage<ChancePoint>> queryList(@PathVariable String scope,
                                                    @PathVariable String adcode,
                                                    @RequestAttribute String appId,
                                                    @RequestParam(defaultValue = "1") int currentPage,
                                                    @RequestParam(defaultValue = "20") int pageSize) {

        IPage page = new Page(currentPage, pageSize);
        IPage<ChancePoint> ret = service.getChancePointList(scope, adcode, appId, page);
        return RestResult.build(ret);
    }

    @GetMapping("/{id}/estimates")
    @ApiOperation("查询机会点评估数据")
    @CheckToken
    public RestResult<List<EstimateResult>> queryEstimateResults(@PathVariable String id,
                                                                 @RequestParam String userAccount) {

        ChancePoint chancePoint = service.queryChance(id);
        List<EstimateResult> ret = service.getChanceEstimateResult(chancePoint, userAccount, new Date());
        return RestResult.build(ret);
    }

    @PostMapping("/{id}/analysis")
    @CheckToken
    public RestResult analysis(@PathVariable String id,
                               @RequestAttribute String appId,
                               @RequestBody List<EstimateResult> estimateResultList) {
        ChancePoint chancePoint = service.queryChance(id);
        if (!appId.equals(chancePoint.getAppId())) {
            return RestResult.fail.msg("你无权操作该数据");
        }
        service.analysis(chancePoint, estimateResultList);
        return null;
    }

    @PostMapping("/{id}/analysisHistory")
    @CheckToken
    public RestResult<List<AnalysisResult>> analysisHistory(@PathVariable String id,
                                                            @RequestAttribute String appId) {
        ChancePoint chancePoint = service.queryChance(id);
        if (!appId.equals(chancePoint.getAppId())) {
            return RestResult.fail.msg("你无权操作该数据");
        }
        List<AnalysisResult> ret = service.analysisHistory(chancePoint);
        return RestResult.build(ret);
    }
}
