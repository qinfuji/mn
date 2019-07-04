package com.mn.modules.api.remote.impl;

import com.mn.modules.api.remote.AuthService;
import com.mn.modules.api.vo.UserInfo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

@Component
public class AuthServiceImpl  implements AuthService {


    @Autowired
    RestTemplate restTemplate;

    public AuthServiceImpl() {
    }

    public AuthServiceImpl(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    @Override
    public UserInfo getUserInfo(String token) {
        UserInfo u = new UserInfo();
        u.setId("xxxxxxx");
        u.setUserName("qinfuji");
        u.setOrganizationId("organizationId");
        return u;
    }
}
