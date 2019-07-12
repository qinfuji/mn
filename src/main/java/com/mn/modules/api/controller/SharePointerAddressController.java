package com.mn.modules.api.controller;

import com.mn.modules.api.entity.SharePointerAddress;
import com.mn.modules.api.qo.PointerAddressQuery;
import com.mn.modules.api.service.SharePointerAddressService;
import com.mn.modules.api.vo.RestResult;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/sharePointerAddresses")
@Api("点址管理")
public class SharePointerAddressController {
    @Autowired
    SharePointerAddressService sharePointerAddressService;

    @PostMapping("/list")
    @ApiOperation("查询共享点址")
    public RestResult<List<SharePointerAddress>> queryList(
            @RequestBody PointerAddressQuery qo) {

        List<SharePointerAddress> ret = sharePointerAddressService.query(qo);
        return RestResult.build(ret);
    }
}
