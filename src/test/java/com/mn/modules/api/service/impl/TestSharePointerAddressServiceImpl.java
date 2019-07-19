package com.mn.modules.api.service.impl;

import com.mn.modules.api.BaseTest;
import com.mn.modules.api.entity.SharePointerAddress;
import com.mn.modules.api.qo.PointerAddressQuery;
import com.mn.modules.api.service.SharePointerAddressService;
import org.junit.Assert;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.Date;
import java.util.List;

public class TestSharePointerAddressServiceImpl extends BaseTest {


    @Autowired
    private SharePointerAddressService sharePointerAddressService;

    private SharePointerAddress getTmpPointerAddress() {
        SharePointerAddress pointerAddress = new SharePointerAddress();
        pointerAddress.setAddress("北京市朝阳区");
        pointerAddress.setName("测试点址");
        pointerAddress.setLat(1.1);
        pointerAddress.setLng(1.1);
        pointerAddress.setCity("100000");
        pointerAddress.setCityName("100000");
        pointerAddress.setProvince("100000");
        pointerAddress.setProvinceName("100000");
        pointerAddress.setDistrict("100000");
        pointerAddress.setDistrictName("100000");
        pointerAddress.setLabels("1,3");
        pointerAddress.setCreatedTime(new Date());
        pointerAddress.setLastUpdatedTime(new Date());
        return pointerAddress;
    }

    @Test
    public void testQuery(){
        SharePointerAddress spa = getTmpPointerAddress();
        sharePointerAddressService.createPointerAddress(spa);

        PointerAddressQuery paq = new PointerAddressQuery();
        paq.setLng("1.1");
        paq.setLat("1.1");
        paq.setDistance(1000);
        List<SharePointerAddress> ll = sharePointerAddressService.query(paq);
        Assert.assertEquals(1 , ll.size());


        paq.setLng("2.1");
        paq.setLat("2.1");
        paq.setDistance(1000);
        ll = sharePointerAddressService.query(paq);
        Assert.assertEquals(0 , ll.size());
    }

    @Test
    public void testImportData(){

    }
}
