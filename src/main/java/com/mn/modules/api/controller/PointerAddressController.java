package com.mn.modules.api.controller;


import com.baomidou.mybatisplus.core.metadata.IPage;
import com.mn.common.validator.ValidatorUtils;
import com.mn.common.validator.group.AddGroup;
import com.mn.common.validator.group.UpdateGroup;
import com.mn.modules.api.annotation.CheckToken;
import com.mn.modules.api.entity.EstimateTask;
import com.mn.modules.api.entity.PointerAddress;
import com.mn.modules.api.qo.PointerAddressQuery;
import com.mn.modules.api.service.PointerAddressService;
import com.mn.modules.api.vo.RestResult;
import com.mn.modules.api.vo.UserInfo;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/pointerAddresses")
@Api("点址管理")
public class PointerAddressController {


    private static Logger logger = LoggerFactory.getLogger(PointerAddressController.class);

    @Autowired
    PointerAddressService service;

    @PostMapping("/createOrUpdate")
    @ApiOperation("创建机会点")
    @CheckToken
    public RestResult<PointerAddress> createOrUpdate(@RequestBody PointerAddress pointerAddress,
                                             @RequestAttribute UserInfo userInfo) {
        try {

            pointerAddress.setUserId(userInfo.getId());
            pointerAddress.setOrganizationId(userInfo.getOrganizationId());
            if(pointerAddress.getId()==null || "".equals(pointerAddress.getId())){
                pointerAddress.setState(PointerAddressService.STATUS_WAIT_SUBMIT);
                return _create(pointerAddress, userInfo);
            }else{
                PointerAddress pa = service.queryPointerAddress(pointerAddress.getId());
                if (userInfo != null && userInfo.getOrganizationId().equals(pa.getOrganizationId())) {
                    ValidatorUtils.validateEntity(pointerAddress, UpdateGroup.class);
                    pointerAddress.setState(PointerAddressService.STATUS_WAIT_SUBMIT);
                    service.updatePointerAddress(pointerAddress);
                    PointerAddress ret = service.queryPointerAddress(pointerAddress.getId());
                    return RestResult.build(ret);
                }else{
                    return RestResult.fail.msg("操作失败.点址不存在或您没有权限操作该数据");
                }
            }

        } catch (Exception e) {
            logger.error("创建点址失败", e);
            return RestResult.fail.msg("创建点址失败! "+e.getMessage());
        }

    }


    @PostMapping("/submit")
    @ApiOperation("创建机会点")
    @CheckToken
    public RestResult<PointerAddress> submit(@RequestBody PointerAddress pointerAddress,
                                             @RequestAttribute UserInfo userInfo) {
        try {
            if (pointerAddress.getId() == null || "".equals(pointerAddress.getId())) {
                pointerAddress.setState(PointerAddressService.STATUS_NOT_ESTIMATE);
                return _create(pointerAddress, userInfo);
            } else {
                PointerAddress pa = service.queryPointerAddress(pointerAddress.getId());
                if (userInfo != null && userInfo.getOrganizationId().equals(pa.getOrganizationId())) {
                    ValidatorUtils.validateEntity(pointerAddress, UpdateGroup.class);
                    pointerAddress.setState(PointerAddressService.STATUS_NOT_ESTIMATE);
                    service.updatePointerAddress(pointerAddress);
                    PointerAddress ret = service.queryPointerAddress(pointerAddress.getId());
                    return RestResult.build(ret);
                }else{
                    return RestResult.fail.msg("操作失败.点址不存在或您没有权限操作该数据");
                }
            }
        } catch (Exception e) {
            logger.error("创建点址失败", e);
            return RestResult.fail.msg("创建点址失败! "+e.getMessage());
        }
    }

    private RestResult<PointerAddress> _create(PointerAddress pointerAddress, UserInfo userInfo) {
        try {
            pointerAddress.setUserId(userInfo.getId());
            pointerAddress.setOrganizationId(userInfo.getOrganizationId());
            ValidatorUtils.validateEntity(pointerAddress, AddGroup.class);
            PointerAddress ret = service.createPointerAddress(pointerAddress);
            return RestResult.build(ret);
        } catch (Exception e) {
            logger.error("创建点址失败", e);
            return RestResult.fail.msg("创建点址失败! "+e.getMessage());
        }
    }


    @GetMapping("/{id}")
    @ApiOperation("机会点详情")
    @CheckToken
    public RestResult<PointerAddress> detail(@PathVariable String id,
                                             @RequestAttribute UserInfo userInfo) {
        PointerAddress pa = service.queryPointerAddress(id);
        if (pa == null) {
            return RestResult.fail.msg("点址不存在");
        }
        if (!userInfo.getOrganizationId().equals(pa.getOrganizationId())) {
            return RestResult.fail.msg("您无权操作该数据");
        }
        return RestResult.build(pa);
    }

    @DeleteMapping("/{id}")
    @ApiOperation("删除")
    @CheckToken
    public RestResult<Boolean> delete(@PathVariable String id, @RequestAttribute UserInfo userInfo) {
        PointerAddress pa = service.queryPointerAddress(id);
        if (pa == null) {
            return RestResult.fail.msg("点址不存在");
        }
        if (!userInfo.getOrganizationId().equals(pa.getOrganizationId())) {
            return RestResult.fail.msg("您无权操作该数据");
        }
        boolean ret = service.invalidPointerAddress(pa);
        return RestResult.build(ret);
    }


    @PostMapping("/list")
    @ApiOperation("查询点址")
    @CheckToken
    public RestResult<IPage<PointerAddress>> queryList(
            @RequestAttribute UserInfo userInfo,
            @RequestBody PointerAddressQuery qo) {
        if (qo.getPageIndex() == null) {
            qo.setPageIndex(1);
        }
        if (qo.getPageSize() == null) {
            qo.setPageSize(40);
        }
        System.out.println(qo);
        IPage<PointerAddress> ret = service.getPointerAddressList(qo, userInfo);
        return RestResult.build(ret);
    }
}
