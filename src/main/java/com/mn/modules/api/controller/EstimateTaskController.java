package com.mn.modules.api.controller;


import com.mn.common.validator.ValidatorUtils;
import com.mn.common.validator.group.UpdateGroup;
import com.mn.modules.api.annotation.CheckToken;
import com.mn.modules.api.entity.EstimateDataResult;
import com.mn.modules.api.entity.EstimateTask;
import com.mn.modules.api.entity.PointerAddress;
import com.mn.modules.api.service.EstimateTaskService;
import com.mn.modules.api.service.PointerAddressService;
import com.mn.modules.api.vo.PointerAddressAndEstimateTask;
import com.mn.modules.api.vo.RestResult;
import com.mn.modules.api.vo.UserInfo;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/estimateTask")
@Api("点址评估任务管理")
public class EstimateTaskController {


    private static Logger logger = LoggerFactory.getLogger(EstimateTaskController.class);

    @Autowired
    private EstimateTaskService service;

    @Autowired
    private PointerAddressService pointerAddressService;

    @PostMapping("/create")
    @ApiOperation("创建评估任务")
    @CheckToken
    public RestResult<EstimateTask> create(@RequestBody EstimateTask estimateTask,
                                           @RequestAttribute UserInfo userInfo) {
        PointerAddress ps = pointerAddressService.queryPointerAddress(estimateTask.getPointerAddressId());
        if (ps == null || userInfo == null || !userInfo.getOrganizationId().equals(ps.getOrganizationId())) {
            return RestResult.fail.msg("点址不存在或您没有权限操作该对象");
        }
        if(estimateTask.getId()==null){
            EstimateTask et = service.getEstimateTaskWithPointerAddressId(ps.getId());
            if (et != null) {
                return RestResult.fail.msg("当前点址任务已存在任务");
            }
        }

        EstimateTask st = service.createEstimate(estimateTask , false);
        return RestResult.build(st);
    }

    @PostMapping("/submit")
    @ApiOperation("保存并提交评估任务")
    @CheckToken
    public RestResult<EstimateTask> submit(@RequestBody EstimateTask estimateTask,
                                           @RequestAttribute UserInfo userInfo) {
        PointerAddress ps = pointerAddressService.queryPointerAddress(estimateTask.getPointerAddressId());
        if (ps == null || userInfo == null || !userInfo.getOrganizationId().equals(ps.getOrganizationId())) {
            return RestResult.fail.msg("点址不存在或您没有权限操作该对象");
        }
        if(estimateTask.getId()==null) {
            EstimateTask et = service.getEstimateTaskWithPointerAddressId(ps.getId());
            if (et != null) {
                return RestResult.fail.msg("当前点址已存在任务");
            }
        }
        EstimateTask st = service.createEstimate(estimateTask , true);
        return RestResult.build(st);
    }




    @PutMapping("/update/{id}")
    @ApiOperation("创建点址任务")
    @CheckToken
    public RestResult<PointerAddress> update(@PathVariable String id,
                                             @RequestBody EstimateTask estimateTask,
                                             @RequestAttribute UserInfo userInfo) {


        ValidatorUtils.validateEntity(estimateTask, UpdateGroup.class);
        EstimateTask pa = service.getById(id);
        PointerAddress ps = pointerAddressService.queryPointerAddress(pa.getPointerAddressId());
        if (ps == null || userInfo == null ||  !userInfo.getOrganizationId().equals(ps.getOrganizationId())) {
            return RestResult.fail.msg("点址不存在或您没有权限操作该对象");
        }
        service.updateById(estimateTask);
        pa = service.getById(id);
        return RestResult.build(pa);
    }

    @DeleteMapping("/delete/{id}")
    @ApiOperation("删除点址评估任务")
    @CheckToken
    public RestResult<Boolean> delete(@PathVariable String id, @RequestAttribute UserInfo userInfo) {

        EstimateTask pa = service.getById(id);
        PointerAddress ps = pointerAddressService.queryPointerAddress(pa.getPointerAddressId());
        if (ps == null || userInfo == null ||  !userInfo.getOrganizationId().equals(ps.getOrganizationId())) {
            return RestResult.fail.msg("点址不存在或您没有权限操作该对象");
        }
        service.invalid(pa);
        return RestResult.ok;
    }


    @GetMapping("/querybyPointerAddressId")
    @ApiOperation("查询点址下的有效任务")
    @CheckToken
    public RestResult<PointerAddressAndEstimateTask> querybyPointerAddressId(
            @RequestAttribute UserInfo userInfo,
            @RequestParam String paId) {


        PointerAddress ps = pointerAddressService.queryPointerAddress(paId);

        if (ps == null || userInfo == null ||  !userInfo.getOrganizationId().equals(ps.getOrganizationId())) {
            return RestResult.fail.msg("点址不存在或您没有权限操作该对象");
        }
        EstimateTask ret = service.getEstimateTaskWithPointerAddressId(paId);
        return RestResult.build(new PointerAddressAndEstimateTask(ps ,ret));
    }


    @GetMapping("/getDataResult")
    @ApiOperation("得到任务的数据结果")
    @CheckToken
    public RestResult<EstimateDataResult> getDataResult(
            @RequestParam String emtimateId) {
        EstimateDataResult ret = service.getEstimateDataResult(emtimateId);
        return RestResult.build(ret);
    }
}
