package com.mn.modules.api.remote.impl;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.mn.modules.api.remote.AuthService;
import com.mn.modules.api.vo.UserInfo;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.List;

@Component
public class AuthServiceImpl  implements AuthService {


    private static Logger logger = LoggerFactory.getLogger(AuthServiceImpl.class);

    private static final String HOST = "http://www.topprismdata.com/_thrid/address";
    private static final String USERINFO_PATH = "/userinfo";


    @Autowired
    RestTemplate restTemplate;

    public AuthServiceImpl() {
    }

    public AuthServiceImpl(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    @Override
    public UserInfo getUserInfo(String token) {


          UserInfo ui = new UserInfo();
          ui.setId("xxx");
          ui.setOrganizationId("organizationId");
          return ui;

//        MultiValueMap<String, String> requestMap = new LinkedMultiValueMap<String, String>();
//        requestMap.add("token", token);
//        ResponseEntity<String> responseBody = restTemplate.getForEntity(HOST+USERINFO_PATH , String.class  , requestMap  );
//        String responseString = responseBody.getBody();
//
//        if(logger.isInfoEnabled()){
//             logger.info("用户请求： {}", responseString);
//        }
//        JSONObject jsonObject = JSON.parseObject(responseString);
//        Integer code = jsonObject.getInteger("code");
//
//        if(code !=0){
//            return null;
//        }
//
//        JSONObject user = jsonObject.getJSONObject("user");
//        if(user != null){
//            JSONArray permissions = jsonObject.getJSONArray("permissions");
//            List<String> permissionList = new ArrayList<>();
//            for (int i = 0; i < permissions.size(); i++) {
//                permissionList.add(permissions.getString(i));
//            }
//            UserInfo u = new UserInfo();
//            u.setId(user.getString("userId"));
//            u.setUserName(user.getString("username"));
//            u.setOrganizationId(user.getString("orgId"));
//            u.setPermissions(permissionList);
//            return u;
//        }
//        return null;
    }
}
