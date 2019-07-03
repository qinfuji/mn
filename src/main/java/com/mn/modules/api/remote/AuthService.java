package com.mn.modules.api.remote;

import com.mn.modules.api.vo.UserInfo;
import org.springframework.stereotype.Component;

@Component
public interface AuthService {
    UserInfo getUserInfo(String token);
}
