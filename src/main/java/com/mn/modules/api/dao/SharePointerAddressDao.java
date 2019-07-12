package com.mn.modules.api.dao;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.mn.modules.api.entity.SharePointerAddress;
import com.mn.modules.api.qo.PointerAddressQuery;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface SharePointerAddressDao  extends BaseMapper<SharePointerAddress> {
    List<SharePointerAddress> querySharePointerAddressList(@Param("qo")PointerAddressQuery qo);
}
