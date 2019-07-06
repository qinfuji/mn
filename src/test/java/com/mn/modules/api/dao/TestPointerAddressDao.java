package com.mn.modules.api.dao;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.mn.modules.api.BaseTest;
import com.mn.modules.api.entity.PointerAddress;
import com.mn.modules.api.entity.PointerAddressLabel;
import com.mn.modules.api.interceptor.TestTokenInterceptor;
import com.mn.modules.api.qo.PointerAddressQuery;
import com.mn.modules.api.service.PointerAddressService;
import com.mn.modules.api.vo.UserInfo;
import org.junit.Assert;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.Date;
import java.util.List;

public class TestPointerAddressDao extends BaseTest {

    @Autowired
    private PointerAddressDao pointerAddressDao;

    @Autowired
    PointerAddressLabelsDao pointerAddressLabelsDao;

    UserInfo userInfo;

    {
        userInfo = new UserInfo();
        userInfo.setOrganizationId("xxx");
    }

    private PointerAddress getTmpPointerAddress() {

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
        pointerAddress.setLabels("1,3");
        pointerAddress.setOrganizationId(TestTokenInterceptor.organizationId);
        pointerAddress.setCreatedTime(new Date());
        pointerAddress.setLastUpdatedTime(new Date());
        pointerAddress.setOrganizationId(this.userInfo.getOrganizationId());
        return pointerAddress;
    }

    @Test
    public void testQueryPointerAddressList() {

        PointerAddress pointerAddress = getTmpPointerAddress();
        pointerAddress.setFence("asdasdasd");
        pointerAddress.setAddress("asdasdasdasdasd");
        pointerAddressDao.insert(pointerAddress);
        PointerAddressQuery qo = new PointerAddressQuery();
        IPage page = new Page(1, 20);
        IPage<PointerAddress> ret = pointerAddressDao.queryPointerAddressList(page, qo, userInfo);
        Assert.assertNotEquals(null, ret);
        Assert.assertEquals(1, ret.getTotal());
        System.out.print(ret.getRecords().get(0));
        Assert.assertNotEquals(null , ret.getRecords().get(0).getFence());

    }


    @Test
    public void testQueryWithLngLat() {

        PointerAddress pointerAddress = getTmpPointerAddress();
        pointerAddressDao.insert(pointerAddress);

        PointerAddressQuery qo = new PointerAddressQuery();
        qo.setDistance(15D);  //15公里范围
        qo.setLat("1.1");
        qo.setLng("1.1");

        IPage page = new Page(1, 20);
        IPage<PointerAddress> ret = pointerAddressDao.queryPointerAddressList(page, qo, userInfo);
        Assert.assertNotEquals(null, ret);
        Assert.assertEquals(1, ret.getTotal());
    }

    @Test
    public void testQueryWithLngLatAndLabels() {

        PointerAddress pointerAddress = getTmpPointerAddress();
        pointerAddress.setLabels("1");
        pointerAddressDao.insert(pointerAddress);
        PointerAddressLabel pal1 = new PointerAddressLabel();
        pal1.setPointerAddressId(pointerAddress.getId());
        pal1.setLabelId(1);
        pointerAddressLabelsDao.insert(pal1);

        PointerAddress pointerAddress1 = getTmpPointerAddress();
        pointerAddress1.setLabels("2");
        pointerAddressDao.insert(pointerAddress1);
        PointerAddressLabel pal2 = new PointerAddressLabel();
        pal2.setPointerAddressId(pointerAddress1.getId());
        pal2.setLabelId(2);
        pointerAddressLabelsDao.insert(pal2);

        PointerAddress pointerAddress3 = getTmpPointerAddress();
        pointerAddress3.setLabels("3");
        pointerAddressDao.insert(pointerAddress3);
        PointerAddressLabel pal3 = new PointerAddressLabel();
        pal3.setPointerAddressId(pointerAddress3.getId());
        pal3.setLabelId(3);
        pointerAddressLabelsDao.insert(pal3);

        PointerAddressQuery qo = new PointerAddressQuery();
        qo.setLabels("1,2");
        qo.setDistance(15D);  //15公里范围
        qo.setLat("1.1");
        qo.setLng("1.1");
        qo.setAddress("北京");
        qo.setScope("city");
        qo.setAdcode("100000");
        IPage page = new Page(1, 1);

        IPage<PointerAddress> ret = pointerAddressDao.queryPointerAddressList(page, qo, userInfo);
        Assert.assertNotEquals(null, ret);
        Assert.assertEquals(2, ret.getTotal());
        Assert.assertEquals(1, ret.getRecords().size());
        Assert.assertEquals(2, ret.getPages());

    }
}
