package com.mn.modules.api.remote.impl;

import com.mn.modules.api.BaseTest;
import com.mn.modules.api.remote.ObservePointService;
import com.mn.modules.api.vo.ArrivedData;
import org.junit.Assert;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;

public class TestObserverPointServiceImpl extends BaseTest {


    @Autowired
    ObservePointService observePointService;

    @Test
    public void testGetObserveArrivedData(){
        List<ArrivedData> ret =   observePointService.getObserveArrivedData("","");
        Assert.assertNotEquals(null , ret);
        Assert.assertNotEquals(0 , ret.size());
    }
}
