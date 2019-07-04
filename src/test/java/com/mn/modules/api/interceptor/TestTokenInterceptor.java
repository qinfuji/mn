package com.mn.modules.api.interceptor;

import com.mn.modules.api.vo.UserInfo;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@Profile({"test"})
@Component
public class TestTokenInterceptor extends TokenInterceptor {

    public static String organizationId = "nmn";

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        UserInfo userInfo = new UserInfo();
        userInfo.setOrganizationId(organizationId);
        userInfo.setUserName("mn");
        userInfo.setId("mn");
        request.setAttribute("userInfo" , userInfo);
        return true;
    }
}
