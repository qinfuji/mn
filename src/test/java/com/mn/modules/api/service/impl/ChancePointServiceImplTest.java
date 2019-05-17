package com.mn.modules.api.service.impl;

import com.mn.modules.api.BaseTest;
import com.mn.modules.api.dao.ChancePointDao;
import com.mn.modules.api.entity.ChancePoint;
import com.mn.modules.api.service.ChancePointService;
import org.junit.Before;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.client.RestTemplate;

import java.util.Date;

import static org.junit.jupiter.api.Assertions.assertNotEquals;

class ChancePointServiceImplTest extends BaseTest {


    @Mock
    RestTemplate restTemplate;

    @Autowired
    ChancePointDao chancePointDao;

    @Autowired
    private ChancePointService chancePointService;

    @Before
    public void init(){
        assertNotEquals(null , restTemplate);
        assertNotEquals(null , chancePointDao);
        chancePointService = new ChancePointServiceImpl(chancePointDao , restTemplate);
    }


    @Test
    void testGetChanceEstimateResult() {
        ChancePoint cp = getTempChancePoint();
        chancePointService.getChanceEstimateResult(cp , "hcrf0380" ,new Date());
    }
}