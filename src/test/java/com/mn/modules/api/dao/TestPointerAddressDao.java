package com.mn.modules.api.dao;

import com.mn.modules.api.BaseTest;
import com.mn.modules.api.entity.PointerAddress;
import com.mn.modules.api.interceptor.TestTokenInterceptor;
import com.mn.modules.api.qo.PointerAddressQuery;
import com.mn.modules.api.service.PointerAddressService;
import com.mn.modules.api.vo.UserInfo;
import org.junit.Assert;
import org.junit.Test;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.Date;
import java.util.List;

public class TestPointerAddressDao extends BaseTest {

    @Autowired
    private PointerAddressDao pointerAddressDao;


    @Test
    public void testQueryWithLabel() {

        PointerAddress pointerAddress = new PointerAddress();
        pointerAddress.setAddress("北京市朝阳区");
        pointerAddress.setType(PointerAddressService.TYPPE_CHANCE);
        pointerAddress.setName("测试点址");
        pointerAddress.setState(PointerAddressService.STATUS_WAIT_SUBMIT);
        pointerAddress.setLat(1.1);
        pointerAddress.setLng(1.1);
        pointerAddress.setCity("100000");
        pointerAddress.setCityName("100000");
        pointerAddress.setProvince("100000");
        pointerAddress.setProvinceName("100000");
        pointerAddress.setDistrict("100000");
        pointerAddress.setDistrictName("100000");
        pointerAddress.setLabels("商业中心");
        pointerAddress.setOrganizationId(TestTokenInterceptor.organizationId);
        pointerAddress.setCreatedTime(new Date());
        pointerAddress.setLastUpdatedTime(new Date());

        pointerAddressDao.insert(pointerAddress);

        PointerAddressQuery qo = new PointerAddressQuery();
        UserInfo userInfo = new UserInfo();
        List<PointerAddress> ret = pointerAddressDao.queryPointerAddressList(qo, userInfo);

        Assert.assertEquals(1, ret.size());
    }

}
