package com.mn.modules.app.service;


import com.baomidou.mybatisplus.service.IService;
import com.mn.modules.app.entity.User;
import com.mn.modules.app.form.LoginForm;

/**
 * 用户
 * 
 * @author duxb
 * @email duxb@mippoint.com
 * @date 2017-03-23 15:22:06
 */
public interface UserService extends IService<User> {

	User queryByMobile(String mobile);

	/**
	 * 用户登录
	 * @param form    登录表单
	 * @return        返回用户ID
	 */
	long login(LoginForm form);
}
