package com.mn.modules.api.controller;


import com.baomidou.mybatisplus.core.metadata.IPage;
import com.mn.common.validator.ValidatorUtils;
import com.mn.common.validator.group.AddGroup;
import com.mn.common.validator.group.UpdateGroup;
import com.mn.modules.api.annotation.CheckToken;
import com.mn.modules.api.entity.PointerAddress;
import com.mn.modules.api.qo.PointerAddressQuery;
import com.mn.modules.api.service.PointerAddressService;
import com.mn.modules.api.vo.RestResult;
import com.mn.modules.api.vo.UserInfo;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/pointer")
@Api("点址管理")
public class PointerAddressController {


    @Autowired
    PointerAddressService service;
    @PostMapping("/create")
    @ApiOperation("创建机会点")
    @CheckToken
    public RestResult<PointerAddress> create(@RequestBody PointerAddress pointerAddress,
                                             @RequestAttribute UserInfo userInfo) {
        pointerAddress.setUserId(userInfo.getId());
        ValidatorUtils.validateEntity(pointerAddress, AddGroup.class);
        PointerAddress ret = service.createPointerAddress(pointerAddress);
        return RestResult.build(ret);
    }

    @PutMapping("/update/{id}")
    @ApiOperation("创建机会点")
    @CheckToken
    public RestResult<PointerAddress> update(@PathVariable String id,
                                          @RequestBody PointerAddress pointerAddress,
                                             @RequestAttribute UserInfo userInfo) {

        if (!userInfo.getId().equals(pointerAddress.getUserId())) {
            return RestResult.fail.msg("您无权操作该数据");
        }
        ValidatorUtils.validateEntity(pointerAddress, UpdateGroup.class);
        PointerAddress ret = service.updatePointerAddress (pointerAddress);
        return RestResult.build(ret);
    }

    @DeleteMapping("/delete/{id}")
    @ApiOperation("删除")
    @CheckToken
    public RestResult<Boolean> delete(@PathVariable String id , @RequestAttribute UserInfo userInfo) {
        PointerAddress cp = service.queryPointerAddress (userInfo.getId());
        if(!userInfo.getId().equals(cp.getUserId())){
            return RestResult.fail.msg("您无权修改!");
        }
        boolean  ret = service.invalidPointerAddress(id);
        return RestResult.build(ret);
    }


    @PostMapping("/list/{scope}")
    @ApiOperation("查询点址")
    @CheckToken
    public RestResult<IPage<PointerAddress>> queryList(
            @RequestAttribute String userId,
            @RequestBody PointerAddressQuery qo) {
        IPage<PointerAddress> ret = service.getPointerAddressList(qo, userId);
        return RestResult.build(ret);
    }
}
