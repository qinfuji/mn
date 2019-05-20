package com.mn.modules.api.remote;

import com.mn.modules.api.BaseTest;
import com.mn.modules.api.entity.ChancePoint;
import com.mn.modules.api.vo.Quota;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.Date;


public class TestChancePointEstimateServiceImpl extends BaseTest {

    @Autowired
    ChancePointEstimateService chancePointEstimateService;

    String appId = "hcr000001";

    @Test
    public void testGetBusinessCirclePopulation(){
        ChancePoint chancePoint = getTempChancePoint();
        chancePoint.setAppId(appId);
        chancePoint.setShopId("95");
        chancePoint.setProvince("10000001");
        chancePoint.setLng(116.4795723047);
        chancePoint.setLat(39.8450571607);
        chancePoint.setProvinceName("北京市");
        chancePoint.setCityName("朝阳区");
        Quota quota = chancePointEstimateService.getBusinessCirclePopulation("hcrf0380", chancePoint , new Date());
        System.out.println(quota);
    }

    @Test
    public void testGetBusinessDistrictCustomerChildrenProportion(){
        ChancePoint chancePoint = getTempChancePoint();
        chancePoint.setAppId(appId);
        chancePoint.setShopId("95");
        chancePoint.setProvince("10000001");
        chancePoint.setLng(116.4795723047);
        chancePoint.setLat(39.8450571607);
        chancePoint.setProvinceName("北京市");
        chancePoint.setCityName("朝阳区");
        chancePointEstimateService.getBusinessDistrictCustomerChildrenProportion("hcrf0380", chancePoint , new Date());
    }
}
