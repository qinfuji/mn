package com.mn.modules.api.remote;

import com.mn.modules.api.BaseTest;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.HashMap;
import java.util.Map;

public class TestShopServiceImpl extends BaseTest {

    @Autowired
    ShopService shopService;

    @Test
    public void testInit(){
        shopService.init("hcrf0380");
    }
}
