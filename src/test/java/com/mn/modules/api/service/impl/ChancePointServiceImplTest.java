package com.mn.modules.api.service.impl;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.mn.modules.api.BaseTest;
import com.mn.modules.api.dao.ChancePointDao;
import com.mn.modules.api.dao.EstimateResultDataDao;
import com.mn.modules.api.entity.ChancePoint;
import com.mn.modules.api.remote.ChancePointEstimateService;
import com.mn.modules.api.remote.ShopService;
import com.mn.modules.api.service.ChancePointService;
import com.mn.modules.api.vo.EstimateResult;
import com.mn.modules.api.vo.Quota;
import com.mn.modules.api.vo.QuotaItem;
import org.junit.Before;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.mockito.ArgumentMatchers.any;

class ChancePointServiceImplTest extends BaseTest {


    @Autowired
    ChancePointDao chancePointDao;

    @Autowired
    private ChancePointService chancePointService;

    @Mock
    private ChancePointEstimateService chancePointEstimateService;

    @Mock
    private ShopService shopService;

    @Autowired
    private EstimateResultDataDao estimateResultDataDao;

    @BeforeEach
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

    @Test
    public void testGetChancePointList() {

        String[]  adcodes = {"100001","1000002","1000003"};
        String[]  names = {"湖北省","武汉市","洪山区"};
        for (int i = 0; i < 50; i++) {
            ChancePoint cp = getTempChancePoint();
            cp.setAppId("1");
            cp.setProvince(adcodes[0]);
            cp.setProvinceName(names[0]);
            cp.setCity(adcodes[1]);
            cp.setCityName(names[1]);
            cp.setDistrict(adcodes[2]);
            cp.setDistrictName(names[2]);
            chancePointDao.insert(cp);
        }
        IPage<ChancePoint> page = new Page(1,10);
        IPage result = chancePointService.getChancePointList(ChancePointService.AREA_SCOPE_DISTRICT , "100001" , "1"  , page);
        assertEquals(result.getTotal() , 0);
        assertEquals(result.getRecords().size() , 0);

        page = new Page(1,10);
        result = chancePointService.getChancePointList(ChancePointService.AREA_SCOPE_PROVINCE , "100001" , "1"  , page);
        assertEquals(result.getTotal() , 50);
        assertEquals(result.getRecords().size() , 10);

        page = new Page(1,10);
        result = chancePointService.getChancePointList(ChancePointService.AREA_SCOPE_CITY , "100001" , "1"  , page);
        assertEquals(result.getTotal() , 0);
        assertEquals(result.getRecords().size() , 0);


        page = new Page(1,10);
        result = chancePointService.getChancePointList(ChancePointService.AREA_SCOPE_PROVINCE , "100001" , "10"  , page);
        assertEquals(result.getTotal() , 0);
        assertEquals(result.getRecords().size() , 0);
    }

    @Test
    void testGetChanceEstimateResult() {

        String accountName = "account";
        ChancePoint cp = new ChancePoint();
        Mockito.when(shopService.getChancePointShopId(accountName ,cp)).thenReturn("1");

        Quota circleActive = new Quota();
        circleActive.setRemark("楼盘数据参考，按照当地人口统计年鉴计算");
        circleActive.setLabel("商圈活跃度");
        QuotaItem item = new QuotaItem();
        item.setLabel("商业主体数量");
        item.setValue(10);
        circleActive.add(item);

        item = new QuotaItem();
        item.setLabel("商务楼数量");
        item.setValue(12);
        circleActive.add(item);

        Mockito.when(chancePointEstimateService.getBusinessCircleActive(any(),any() , any())).thenReturn(circleActive);


        Quota circlePopulation = new Quota();
        circlePopulation.setRemark("楼盘数据参考，按照当地人口统计年鉴计算");
        circlePopulation.setLabel("商圈人口体量");
        item = new QuotaItem();
        item.setLabel("人口总量");
        item.setValue(10);
        circlePopulation.add(item);

        item = new QuotaItem();
        item.setLabel("固定人口");
        item.setValue(12);
        circlePopulation.add(item);
        Mockito.when(chancePointEstimateService.getBusinessCirclePopulation(any(),any() , any())).thenReturn(circlePopulation);


        Quota circleActiveTop = new Quota();
        circleActiveTop.setRemark("商圈内商业主体、商务楼、社区距离top榜");
        circleActiveTop.setLabel("商圈活跃度Top榜");
        item = new QuotaItem();
        item.setLabel("商业主体");
        List<QuotaItem> subValueList = new ArrayList<>();
        QuotaItem subitem = new QuotaItem();
        subitem.setLabel("xx便利店");
        subitem.setValue(100);
        subValueList.add(subitem);
        subitem = new QuotaItem();
        subitem.setLabel("xx超市");
        subitem.setValue(100);
        subValueList.add(subitem);
        subitem = new QuotaItem();
        subitem.setLabel("xx中心");
        subitem.setValue(100);
        subValueList.add(subitem);
        item.setValue(subValueList);
        circleActiveTop.add(item);


        Mockito.when(chancePointEstimateService.getBusinessCircleActiveTop (any(),any() , any())).thenReturn(circleActiveTop);


        Quota districtActive = new Quota();
        districtActive.setRemark("楼盘数据参考，按照当地人口统计年鉴计算");
        districtActive.setLabel("商区活跃度");
        item = new QuotaItem();
        item.setLabel("商业主体数量");
        item.setValue(10);
        districtActive.add(item);

        item = new QuotaItem();
        item.setLabel("商务楼数量");
        item.setValue(12);
        districtActive.add(item);
        Mockito.when(chancePointEstimateService.getBusinessDistrictActive (any(),any() , any())).thenReturn(districtActive);

        List<EstimateResult> result =  chancePointService.getChanceEstimateResult(cp , accountName , new Date());
        assertEquals(result.size() , 3);

    }
}