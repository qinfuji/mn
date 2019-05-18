package com.mn.modules.api.service.impl;

import com.mn.modules.api.BaseTest;
import com.mn.modules.api.dao.ChancePointDao;
import com.mn.modules.api.dao.EstimateResultDataDao;
import com.mn.modules.api.entity.ChancePoint;
import com.mn.modules.api.remote.ChancePointEstimateService;
import com.mn.modules.api.remote.ShopService;
import com.mn.modules.api.service.ChancePointService;
import org.junit.Before;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.client.RestTemplate;

import java.util.Date;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotEquals;

class ChancePointServiceImplTest extends BaseTest {


    @Autowired
    ChancePointDao chancePointDao;

    @Autowired
    private ChancePointService chancePointService;

    @Autowired
    private ChancePointEstimateService chancePointEstimateService;

    @Autowired
    private ShopService shopService;

    @Autowired
    private EstimateResultDataDao estimateResultDataDao;

    @Before
    public void init() {
        chancePointService = new ChancePointServiceImpl(
                chancePointDao, estimateResultDataDao, chancePointEstimateService, shopService);
    }


    @Test
    public void testCreateChancePoint() {
        ChancePoint chancePoint = getTempChancePoint();
        chancePointService.createChancePoint(chancePoint);
        assertNotEquals(null, chancePoint.getId());
    }

    @Test
    public void testUpdateChancePoint() {
        ChancePoint chancePoint = getTempChancePoint();
        chancePointService.createChancePoint(chancePoint);
        assertNotEquals(null, chancePoint.getId());

        ChancePoint updateChancePoint = new ChancePoint();
        updateChancePoint.setId(chancePoint.getId());
        updateChancePoint.setAddress("北京市朝阳区街道一");
        chancePointService.updateChancePoint(updateChancePoint);

        ChancePoint ret = chancePointDao.selectById(chancePoint.getId());
        assertEquals(ret.getAddress(), "北京市朝阳区街道一");
    }

    public void testGetChancePointList() {
        for (int i = 0; i < 50; i++) {
            ChancePoint cp = getTempChancePoint();
            chancePointDao.insert(cp);
        }


    }

    @Test
    void testGetChanceEstimateResult() {
//        ChancePoint cp = getTempChancePoint();
//        chancePointService.getChanceEstimateResult(cp, "hcrf0380", new Date());
    }
}