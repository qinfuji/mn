package com.mn.modules.api.dao;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.mn.modules.api.entity.PointerAddress;
import com.mn.modules.api.qo.PointerAddressQuery;
import com.mn.modules.api.vo.UserInfo;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface PointerAddressDao extends  BaseMapper<PointerAddress> {


    IPage<PointerAddress>  queryPointerAddressList(IPage<PointerAddress> page , @Param("qo")PointerAddressQuery qo , @Param("userInfo") UserInfo userInfo);

    List<PointerAddress> queryPointerAddressList1(@Param("qo")PointerAddressQuery qo , @Param("userInfo") UserInfo userInfo);
}
