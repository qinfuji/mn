package com.mn.modules.api.interceptor;

import com.mn.common.exception.RRException;
import com.mn.modules.api.annotation.CheckToken;
import com.mn.modules.api.remote.AuthService;
import com.mn.modules.api.utils.JwtUtils;
import com.mn.modules.api.vo.UserInfo;
import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Profile;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.method.HandlerMethod;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@Profile({"prod","dev","sit"})
@Component
public class UserTokenInterceptor extends TokenInterceptor {
    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private AuthService authService;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        CheckToken annotation;
        if(handler instanceof HandlerMethod) {
            annotation = ((HandlerMethod) handler).getMethodAnnotation(CheckToken.class);
        }else{
            return true;
        }

        if(annotation == null){
            return true;
        }

        //获取用户凭证
        String token = request.getHeader(jwtUtils.getHeader());
        if(StringUtils.isBlank(token)){
            token = request.getParameter(jwtUtils.getHeader());
        }

        //凭证为空
        if(StringUtils.isBlank(token)){
            throw new RRException(jwtUtils.getHeader() + "不能为空", HttpStatus.UNAUTHORIZED.value());
        }

        UserInfo userInfo =  authService.getUserInfo(token);


        if(userInfo == null){
            throw new RRException("您无权操作该数据", HttpStatus.UNAUTHORIZED.value());
        }

        request.setAttribute("userInfo" , userInfo);

        return true;
    }
}
