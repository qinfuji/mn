package com.mn.modules.api.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.mn.modules.api.entity.SharePointerAddress;
import com.mn.modules.api.qo.PointerAddressQuery;

import java.util.List;

public interface SharePointerAddressService extends IService<SharePointerAddress> {
     List<SharePointerAddress>  query(PointerAddressQuery pq);


     SharePointerAddress createPointerAddress(SharePointerAddress pointerAddress);
}
