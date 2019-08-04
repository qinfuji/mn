package com.mn.modules.api.controller;


import com.mn.modules.api.annotation.CheckToken;
import com.mn.modules.api.vo.RestResult;
import com.mn.modules.api.vo.UserInfo;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/auth")
@Api("认证授权管理")
public class AuthController {


    @GetMapping("/userPermissions")
    @ApiOperation("获取用户授权信息")
    @CheckToken
    public RestResult<List<String>> getUserPermissions(
            @RequestAttribute UserInfo userInfo) {
        return RestResult.build(userInfo.getPermissions());
    }
}
