package com.mn.modules.api.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.mn.modules.api.BaseTest;
import com.mn.modules.api.dao.PointerAddressLabelsDao;
import com.mn.modules.api.entity.PointerAddress;
import com.mn.modules.api.entity.PointerAddressLabel;
import com.mn.modules.api.service.PointerAddressService;
import org.junit.Assert;
import org.junit.Test;
import org.junit.jupiter.api.BeforeEach;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;

public class PointerAddressServiceImplTest extends BaseTest {


    @Autowired
    public PointerAddressService pointerAddressService;

    @Autowired
    public PointerAddressLabelsDao pointerAddressLabelsDao;

    @BeforeEach
    public void init() {

    }

    @Test
    public void testCreate(){

        PointerAddress pointerAddress = new PointerAddress();
        pointerAddress.setName("北京市朝阳区");
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
        pointerAddress.setLabels("1,2,3");

        pointerAddress.setAddress("我在测试地址");
        pointerAddress = pointerAddressService.createPointerAddress(pointerAddress);
        Assert.assertNotEquals(null , pointerAddress.getId());
        Assert.assertNotEquals(null , pointerAddress.getCreatedTime());
        Assert.assertNotEquals(null , pointerAddress.getLastUpdatedTime());

        QueryWrapper<PointerAddressLabel> pal = new QueryWrapper<>();
        pal.eq("pointer_address_id" , pointerAddress.getId());
        List<PointerAddressLabel> pointerAddressLabelList =  pointerAddressLabelsDao.selectList(pal);
        Assert.assertNotEquals(null , pointerAddressLabelList);
        Assert.assertEquals(3 , pointerAddressLabelList.size());

    }


    @Test
    public void testUpdateLabels(){

        PointerAddress pointerAddress = new PointerAddress();
        pointerAddress.setName("北京市朝阳区");
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
        pointerAddress.setLabels("1,2,3");

        pointerAddress.setAddress("我在测试地址");
        pointerAddress = pointerAddressService.createPointerAddress(pointerAddress);
        Assert.assertNotEquals(null , pointerAddress.getId());
        Assert.assertNotEquals(null , pointerAddress.getCreatedTime());
        Assert.assertNotEquals(null , pointerAddress.getLastUpdatedTime());


        PointerAddress updatePointerAddress = new PointerAddress();
        updatePointerAddress.setLabels("5,6,7,8");
        updatePointerAddress.setId(pointerAddress.getId());
        updatePointerAddress.setVersion(pointerAddress.getVersion());
        updatePointerAddress =  pointerAddressService.updatePointerAddress(updatePointerAddress);


        Assert.assertNotEquals("5,6,7,8" , pointerAddress.getLabels());


        QueryWrapper<PointerAddressLabel> pal = new QueryWrapper<>();
        pal.eq("pointer_address_id" , pointerAddress.getId());
        List<PointerAddressLabel> pointerAddressLabelList =  pointerAddressLabelsDao.selectList(pal);
        Assert.assertNotEquals(null , pointerAddressLabelList);
        Assert.assertEquals(4 , pointerAddressLabelList.size());
    }



}