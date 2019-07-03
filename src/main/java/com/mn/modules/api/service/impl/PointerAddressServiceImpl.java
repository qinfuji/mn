package com.mn.modules.api.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.mn.modules.api.dao.PointerAddressDao;
import com.mn.modules.api.entity.PointerAddress;
import com.mn.modules.api.qo.PointerAddressQuery;
import com.mn.modules.api.service.PointerAddressService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


@Service
public class PointerAddressServiceImpl implements PointerAddressService {


    @Autowired
    private PointerAddressDao pointerAddressDao;


    public PointerAddressServiceImpl() {
    }


    public PointerAddressServiceImpl(PointerAddressDao pointerAddressDao) {
        this.pointerAddressDao = pointerAddressDao;
    }

    @Override
    public PointerAddress createPointerAddress(PointerAddress pointerAddress) {
        pointerAddressDao.insert(pointerAddress);
        return pointerAddress;
    }

    @Override
    public PointerAddress queryPointerAddress(String id) {
        return pointerAddressDao.selectById(id);
    }

    @Override
    public PointerAddress updatePointerAddress(PointerAddress pointerAddress) {
        pointerAddressDao.updateById(pointerAddress);
        return pointerAddress;
    }

    @Override
    public boolean invalidPointerAddress(String id) {
        PointerAddress cp = new PointerAddress();
        cp.setStatus(POINTER_ADDRESS_STATUS_INVALID);
        cp.setId(id);
        pointerAddressDao.updateById(cp);
        return true;
    }

    @Override
    public IPage<PointerAddress> getPointerAddressList(PointerAddressQuery qo, String userId) {
        QueryWrapper<PointerAddress> queryWrapper = new QueryWrapper<>();

        queryWrapper.eq("appId", userId);
        if ("".equals(qo.getAddress()) && qo.getAddress() != null) {
            queryWrapper.like("address", qo.getAddress());
        }
        //无效状态的不显示
        queryWrapper.ne("status", POINTER_ADDRESS_STATUS_INVALID);
        if ("".equals(qo.getScope()) && qo.getScope() != null) {
            if (AREA_SCOPE_PROVINCE.equals(qo.getScope())) {
                queryWrapper.eq("province", qo.getAdcode());
            } else if (AREA_SCOPE_CITY.equals(qo.getScope())) {
                queryWrapper.eq("city", qo.getAdcode());
            } else if (AREA_SCOPE_DISTRICT.equals(qo.getScope())) {
                queryWrapper.eq("district", qo.getAdcode());
            }
        }
        IPage pageParam = new Page(qo.getPageIndex(), qo.getPageSize());
        IPage page = pointerAddressDao.selectPage(pageParam, queryWrapper);

        return page;
    }
}
