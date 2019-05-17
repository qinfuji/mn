package com.mn.modules.api.controller;


import io.swagger.annotations.Api;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * APP测试接口
 *
 * @author duxb
 * @email duxb@mippoint.com
 * @date 2017-03-23 15:47
 */
@RestController
@RequestMapping("/app")
@Api("APP测试接口")
public class AppTestController {
//
//    @Login
//    @GetMapping("userInfo")
//    @ApiOperation("获取用户信息")
//    public R userInfo(@LoginUser User user){
//        return R.ok().put("user", user);
//    }
//
//    @Login
//    @GetMapping("userId")
//    @ApiOperation("获取用户ID")
//    public R userInfo(@RequestAttribute("userId") Integer userId){
//        return R.ok().put("userId", userId);
//    }
//
//    @GetMapping("notToken")
//    @ApiOperation("忽略Token验证测试")
//    public R notToken(){
//        return R.ok().put("msg", "无需token也能访问。。。");
//    }

}
