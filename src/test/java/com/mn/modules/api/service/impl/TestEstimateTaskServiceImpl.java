package com.mn.modules.api.service.impl;

import com.mn.modules.api.BaseTest;
import com.mn.modules.api.dao.*;
import com.mn.modules.api.entity.*;
import com.mn.modules.api.interceptor.TestTokenInterceptor;
import com.mn.modules.api.remote.DataService;
import com.mn.modules.api.remote.ObservePointService;
import com.mn.modules.api.service.CategroyLabelService;
import com.mn.modules.api.service.EstimateTaskService;
import com.mn.modules.api.service.PointerAddressService;
import com.mn.modules.api.service.SharePointerAddressService;
import com.mn.modules.api.utils.LngLat;
import com.mn.modules.api.vo.ArrivedData;
import com.mn.modules.api.vo.ObserverPointData;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.junit.jupiter.api.BeforeEach;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;

public class TestEstimateTaskServiceImpl extends BaseTest {

    @Autowired
    PointerAddressService pointerAddressService;

    @Autowired
    SharePointerAddressService sharePointerAddressService;

    @Mock
    DataService dataService;

    @Autowired
    PointerAddressDao pointerAddressDao;

    @Autowired
    SharePointerAddressDao sharePointerAddressDao;

    @Mock
    ObservePointService observePointService;


    @Autowired
    EstimateTaskDao estimateTaskDao;

    @Autowired
    EstimateDataResultDao estimateDataResultDao;

    EstimateTaskService estimateTaskService;


    @Autowired
    CategroyLabelDao categroyLabelDao;


    @BeforeEach
    @Before
    public void init() {
        estimateTaskService = new EstimateTaskServiceImpl(observePointService, estimateTaskDao, sharePointerAddressDao,pointerAddressDao, estimateDataResultDao, dataService);
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
        return pointerAddress;
    }

    private SharePointerAddress getTmpSharePointerAddress() {

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
    public void execCalculateFence() {

        CategroyLabel cl = new CategroyLabel();
        cl.setState(CategroyLabelService.STATE_NORMAL);
        cl.setLabel("测试一");
        categroyLabelDao.insert(cl);

        String id1 = cl.getId();

        CategroyLabel cl1 = new CategroyLabel();
        cl1.setState(CategroyLabelService.STATE_NORMAL);
        cl1.setLabel("测试二");
        categroyLabelDao.insert(cl1);
        String id2 = cl1.getId();

        //竞品点址
        PointerAddress cpa = getTmpPointerAddress();
        cpa.setLng(116.532049);
        cpa.setLat(40.024517);
        cpa.setAddress("北京市朝阳区崔各庄镇卓锦万代");
        cpa.setState(PointerAddressService.STATUS_WAIT_ESTIMATE);
        cpa.setType(PointerAddressService.TYPPE_COMPETITION_SHOP);
        cpa.setFence("116.530182,40.027162;116.530783,40.022397;116.534946,40.023482;116.534388,40.027524");
        pointerAddressDao.insert(cpa);


        cpa = getTmpPointerAddress();
        cpa.setLng(116.537928);
        cpa.setLat(40.031681);
        cpa.setAddress("北京市朝阳区孙河镇康营清真寺");
        cpa.setState(PointerAddressService.STATUS_WAIT_ESTIMATE);
        cpa.setType(PointerAddressService.TYPPE_COMPETITION_SHOP);
        cpa.setFence("116.534431,40.033702;116.534903,40.029331;116.540611,40.029758;116.540139,40.033274");
        pointerAddressDao.insert(cpa);

        cpa = getTmpPointerAddress();
        cpa.setLng(116.518831);
        cpa.setLat(40.031582);
        cpa.setAddress("北京市朝阳区孙河镇香江花园别墅");
        cpa.setState(PointerAddressService.STATUS_WAIT_ESTIMATE);
        cpa.setType(PointerAddressService.TYPPE_COMPETITION_SHOP);
        cpa.setFence("116.515205,40.033241;116.515333,40.029857;116.519367,40.02989;116.51941,40.029265;116.522329,40.029364;116.523101,40.030941;116.520741,40.031106;116.520397,40.031861;116.52117,40.032749;116.524174,40.033143;116.524646,40.032847;116.52559,40.034063;116.51499,40.033504");
        pointerAddressDao.insert(cpa);


        cpa = getTmpPointerAddress();
        cpa.setLng(116.515655);
        cpa.setLat(40.018207);
        cpa.setAddress("北京市朝阳区崔各庄镇东隆别墅");
        cpa.setState(PointerAddressService.STATUS_WAIT_ESTIMATE);
        cpa.setType(PointerAddressService.TYPPE_COMPETITION_SHOP);
        cpa.setFence("116.513488,40.019834;116.513745,40.016744;116.51808,40.016942;116.518337,40.020787");
        pointerAddressDao.insert(cpa);

        //公共点址
        SharePointerAddress spa = getTmpSharePointerAddress();
        spa.setLng(116.542926);
        spa.setLat(40.008762);
        spa.setLabels(id1+","+id2);
        spa.setAddress("北京市朝阳区金盏镇长店大街");
        spa.setFence("116.541252,40.009896;116.541252,40.007102;116.545415,40.007332;116.546016,40.009962");
        sharePointerAddressService.createPointerAddress(spa);


        spa = getTmpSharePointerAddress();
        spa.setLng(116.527777);
        spa.setLat(40.010274);
        spa.setLabels(id1+","+id2);
        spa.setAddress("北京市朝阳区崔各庄镇京旺家园(三区)京旺家园三区");
        spa.setFence("116.5234,40.010751;116.525932,40.010701;116.525975,40.008548;116.530996,40.008581;116.531039,40.012394;116.523228,40.01223");

        sharePointerAddressService.createPointerAddress(spa);


        spa = getTmpSharePointerAddress();
        spa.setLng(116.523013);
        spa.setLat(40.019806);
        spa.setLabels(id1+","+id2);
        spa.setAddress("北京市朝阳区崔各庄镇太利花园");
        spa.setFence("116.519794,40.0214;116.520352,40.017883;116.526146,40.018343;116.525717,40.021269;116.525202,40.023996;116.521253,40.023668;116.523571,40.021466");
        sharePointerAddressService.createPointerAddress(spa);


        spa = getTmpSharePointerAddress();
        spa.setLng(116.539364);
        spa.setLat(40.020069);
        spa.setLabels(id1+","+id2);
        spa.setAddress("北京市朝阳区崔各庄镇朝林科技园");
        //spa.setFence("116.536961,40.022353;116.537347,40.017916;116.544471,40.017883;116.544943,40.022583;116.54181,40.024128;116.541209,40.021959;116.541209,40.021959");
        spa.setFence("116.536961,40.022353;116.537347,40.017916;116.544471,40.017883;116.544943,40.022583;116.54181,40.024128;116.541209,40.021959");
        sharePointerAddressService.createPointerAddress(spa);

        spa = getTmpSharePointerAddress();
        spa.setLng(116.533873);
        spa.setLat(40.02013);
        spa.setLabels(id1+","+id2);
        spa.setAddress("北京市朝阳区崔各庄镇首都机场辅路");
        spa.setFence("116.531598,40.022266;116.531384,40.018027;116.53619,40.018881;116.536319,40.019407");
        sharePointerAddressService.createPointerAddress(spa);


        spa = getTmpSharePointerAddress();
        spa.setLng(116.536319);
        spa.setLat(40.009661);
        spa.setLabels(id1+","+id2);
        spa.setAddress("北京市朝阳区金盏镇长店大街62");
        spa.setFence("116.534087,40.011222;116.535933,40.008231;116.538443,40.008149;116.539752,40.011288");
        sharePointerAddressService.createPointerAddress(spa);


        PointerAddress pa = getTmpPointerAddress();
        pa.setLng(116.534987);
        pa.setLat(40.015172);
        pa.setAddress("北京市朝阳区崔各庄镇北京国际航空俱乐部");
        pa.setState(PointerAddressService.STATUS_NOT_ESTIMATE);
        pointerAddressService.createPointerAddress(pa);


        EstimateTask estimateTask = new EstimateTask();
        estimateTask.setPointerAddressId(pa.getId());
        estimateTask.setDistance(155000);
        estimateTask.setExecState(EstimateTaskService.EXEC_STATUS_NULL);
        estimateTask.setObserveId("observerId");
        estimateTask.setCompetitorIds(cpa.getId());
        estimateTask.setFilterLabels(id1+","+id2);
        estimateTask.setArriveScale(60);
        estimateTaskService.createEstimate(estimateTask , true);

        PointerAddress pointerAddress = pointerAddressService.queryPointerAddress(estimateTask.getPointerAddressId());
        Assert.assertEquals(PointerAddressService.STATUS_WAIT_ESTIMATE , pointerAddress.getState());



        ObserverPointData opd = new ObserverPointData();

        List<ArrivedData> observerArrivedDataList = new ArrayList<>();
        LngLat lnglat = new LngLat();
        ArrivedData  arrivedData = new ArrivedData();
        lnglat.setLng(116.542926);
        lnglat.setLat(40.008762);
        arrivedData.setLngLat(lnglat);
        arrivedData.setArrivedRate(100D);
        observerArrivedDataList.add(arrivedData);

        lnglat = new LngLat();
        arrivedData = new ArrivedData();
        lnglat.setLng(116.527777);
        lnglat.setLat(40.010274);
        arrivedData.setLngLat(lnglat);
        arrivedData.setArrivedRate(100D);
        observerArrivedDataList.add(arrivedData);

        lnglat = new LngLat();
        arrivedData = new ArrivedData();
        lnglat.setLng(116.523013);
        lnglat.setLat(40.019806);
        arrivedData.setLngLat(lnglat);
        arrivedData.setArrivedRate(100D);
        observerArrivedDataList.add(arrivedData);

        lnglat = new LngLat();
        arrivedData = new ArrivedData();
        lnglat.setLng(116.539364);
        lnglat.setLat(40.020069);
        arrivedData.setLngLat(lnglat);
        arrivedData.setArrivedRate(100D);
        observerArrivedDataList.add(arrivedData);

        lnglat = new LngLat();
        arrivedData = new ArrivedData();
        lnglat.setLng(116.533873);
        lnglat.setLat(40.02013);
        arrivedData.setLngLat(lnglat);
        arrivedData.setArrivedRate(100D);
        observerArrivedDataList.add(arrivedData);

        new ArrivedData();
        arrivedData = new ArrivedData();
        lnglat = new LngLat();
        lnglat.setLng(116.532049);
        lnglat.setLat(40.024517);
        arrivedData.setLngLat(lnglat);
        arrivedData.setArrivedRate(100D);
        observerArrivedDataList.add(arrivedData);

        Mockito.when(observePointService.getObserveArrivedData (any(),any())).thenReturn(observerArrivedDataList);
        estimateTaskService.execCalculateFence(estimateTask);

        EstimateTask estimateTask1 = estimateTaskService.getById(estimateTask.getId());
        Assert.assertEquals(EstimateTaskService.EXEC_STATUS_CALCULATED_FENCE , EstimateTaskService.EXEC_STATUS_CALCULATED_FENCE&estimateTask1.getExecState());

        EstimateDataResult edr = estimateTaskService.getEstimateDataResult(estimateTask1.getId());
        Assert.assertNotNull(null , edr.getFence());


        Mockito.when(dataService.getFenceEstimateData(any())).thenReturn(new ArrayList());
        Mockito.when(dataService.getFenceHotData(any())).thenReturn(new ArrayList());

        estimateTask1 = estimateTaskService.getById(estimateTask1.getId());
        estimateTaskService.execRequestFenceData(estimateTask1);
        estimateTask1 = estimateTaskService.getById(estimateTask1.getId());
        estimateTaskService.execRequestUserFenceHotData(estimateTask1);

        //estimateTask1 = estimateTaskService.getById(estimateTask1.getId());

        Assert.assertEquals(EstimateTaskService.EXEC_STATUS_REQUESTED_FENCE_DATA , EstimateTaskService.EXEC_STATUS_REQUESTED_FENCE_DATA&estimateTask1.getExecState().intValue());
        Assert.assertEquals(EstimateTaskService.EXEC_STATUS_REQUESTED_FENCE_HOT_DATA , EstimateTaskService.EXEC_STATUS_REQUESTED_FENCE_HOT_DATA&estimateTask1.getExecState().intValue());
        Assert.assertEquals(EstimateTaskService.EXEC_STATUS_FINISH_CODE , estimateTask1.getExecState().intValue());

        pointerAddress = pointerAddressService.queryPointerAddress(estimateTask.getPointerAddressId());
        Assert.assertEquals(PointerAddressService.STATUS_ESTIMATE_FINISH , pointerAddress.getState());
    }




}
