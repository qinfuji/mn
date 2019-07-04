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
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/pointerAddress")
@Api("点址管理")
public class PointerAddressController {


    private  static Logger logger = LoggerFactory.getLogger(PointerAddressController.class);

    @Autowired
    PointerAddressService service;

    @PostMapping("/create")
    @ApiOperation("创建机会点")
    @CheckToken
    public RestResult<PointerAddress> create(@RequestBody PointerAddress pointerAddress,
                                             @RequestAttribute UserInfo userInfo) {
        try{
            System.out.println(userInfo);
            pointerAddress.setUserId(userInfo.getId());
            pointerAddress.setOrganizationId(userInfo.getOrganizationId());
            ValidatorUtils.validateEntity(pointerAddress, AddGroup.class);
            PointerAddress ret = service.createPointerAddress(pointerAddress);
            return RestResult.build(ret);
        }catch(Exception e){
            logger.error("创建点址失败" , e);
            return RestResult.fail.msg("创建点址失败");
        }

    }

    @PutMapping("/update/{id}")
    @ApiOperation("创建机会点")
    @CheckToken
    public RestResult<PointerAddress> update(@PathVariable String id,
                                          @RequestBody PointerAddress pointerAddress,
                                             @RequestAttribute UserInfo userInfo) {


        PointerAddress pa =  service.queryPointerAddress(id);
        if(pa == null){
             return RestResult.fail.msg("点址不存在");
        }
        if (!userInfo.getOrganizationId().equals(pa.getOrganizationId())) {
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
        PointerAddress pa =  service.queryPointerAddress(id);
        if(pa == null){
            return RestResult.fail.msg("点址不存在");
        }
        if (!userInfo.getOrganizationId().equals(pa.getOrganizationId())) {
            return RestResult.fail.msg("您无权操作该数据");
        }
        boolean  ret = service.invalidPointerAddress(pa);
        return RestResult.build(ret);
    }


    @PostMapping("/list/{scope}")
    @ApiOperation("查询点址")
    @CheckToken
    public RestResult<IPage<PointerAddress>> queryList(
            @RequestAttribute UserInfo userInfo,
            @RequestBody PointerAddressQuery qo) {
        IPage<PointerAddress> ret = service.getPointerAddressList(qo, userInfo);
        return RestResult.build(ret);
    }
}
