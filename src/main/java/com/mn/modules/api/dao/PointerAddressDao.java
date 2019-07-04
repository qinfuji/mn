package com.mn.modules.api.dao;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.mn.modules.api.entity.PointerAddress;
import com.mn.modules.api.qo.PointerAddressQuery;
import com.mn.modules.api.vo.UserInfo;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface PointerAddressDao extends  BaseMapper<PointerAddress> {

    //@Select("SELECT a.id,a.`name`,a.age,b.`describe` FROM USER a LEFT JOIN userinfo b ON a.id = b.user_id where a.id=#{id}")
    //List<Map<String, Object>> dyGetUserList(Page<Map<String,Object>> page,Integer id);
    //@Select("select * from where qo.")
    List<PointerAddress>  queryPointerAddressList(@Param("qo")PointerAddressQuery qo , @Param("userInfo") UserInfo userInfo);
}
