package com.mn.modules.api.controller;

import com.mn.common.utils.R;
import com.mn.modules.api.utils.Tools;
import com.mn.modules.app.utils.JwtUtils;
import io.jsonwebtoken.Claims;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
@Api("数据交换")
public class TokenCoreController {

    private static Logger logger = LoggerFactory.getLogger(TokenCoreController.class);
    @Value("${mnbi.app.appid}")
    private String AppId;
    @Autowired
    private JwtUtils jwtUtils;

    @PostMapping("/gettoken")
    @ApiOperation("获取token")
    public R getToken(@RequestParam Map<String, Object> params){
        Map<String, String> map = Tools.toVerifyMap(params,false);
        String secretKey =  map.get("appId");

        if (StringUtils.isEmpty(secretKey) || !map.get("appId").equals(AppId)){
            return R.error("无效的appId");
        }
        if (Tools.verify(map)){
            //验证通过后根据appid 或者慧辰账户生成token
            String token= jwtUtils.generateToken(secretKey);
            Map<String, Object> resmap = new HashMap<>();
            resmap.put("token", token);
            resmap.put("expire", jwtUtils.getNowExpire());
            return R.ok(resmap);
        }else {
            return R.error("token获取失败");
        }
    }
    @PostMapping("/verifytoken")
    public R verifyToken(@RequestParam String token){
        if (StringUtils.isEmpty(token)){
            return R.error(401,"无效的token");
        }
        Claims claims = jwtUtils.getClaimByToken(token);
        if(claims == null || jwtUtils.isTokenExpired(claims.getExpiration())){
            return R.error(401,"无效的token");
        }
        return R.ok("验证通过");
    }
}
