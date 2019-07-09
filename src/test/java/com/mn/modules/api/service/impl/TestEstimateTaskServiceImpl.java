package com.mn.modules.api.service.impl;

import com.mn.modules.api.BaseTest;
import com.mn.modules.api.dao.EstimateDataResultDao;
import com.mn.modules.api.dao.EstimateTaskDao;
import com.mn.modules.api.dao.PointerAddressDao;
import com.mn.modules.api.entity.EstimateDataResult;
import com.mn.modules.api.entity.EstimateTask;
import com.mn.modules.api.entity.PointerAddress;
import com.mn.modules.api.interceptor.TestTokenInterceptor;
import com.mn.modules.api.remote.DataService;
import com.mn.modules.api.remote.ObservePointService;
import com.mn.modules.api.service.EstimateTaskService;
import com.mn.modules.api.service.PointerAddressService;
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

    @Mock
    DataService dataService;

    @Autowired
    PointerAddressDao pointerAddressDao;

    @Mock
    ObservePointService observePointService;


    @Autowired
    EstimateTaskDao estimateTaskDao;

    @Autowired
    EstimateDataResultDao estimateDataResultDao;

    EstimateTaskService estimateTaskService;


    @BeforeEach
    @Before
    public void init() {
        estimateTaskService = new EstimateTaskServiceImpl(observePointService, estimateTaskDao, pointerAddressDao, estimateDataResultDao, dataService);
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


    @Test
    public void execCalculateFence() {
        PointerAddress pa = getTmpPointerAddress();
        pa.setLng(116.542926);
        pa.setLat(40.008762);
        pa.setAddress("北京市朝阳区金盏镇长店大街");
        pa.setFence("116.541252,40.009896;116.541252,40.007102;116.545415,40.007332;116.546016,40.009962");
        pa.setState(PointerAddressService.STATUS_WAIT_ESTIMATE);
        pointerAddressService.createPointerAddress(pa);


        pa = getTmpPointerAddress();
        pa.setLng(116.527777);
        pa.setLat(40.010274);
        pa.setAddress("北京市朝阳区崔各庄镇京旺家园(三区)京旺家园三区");
        pa.setFence("116.5234,40.010751;116.525932,40.010701;116.525975,40.008548;116.530996,40.008581;116.531039,40.012394;116.523228,40.01223");
        pa.setState(PointerAddressService.STATUS_WAIT_ESTIMATE);
        pointerAddressService.createPointerAddress(pa);


        pa = getTmpPointerAddress();
        pa.setLng(116.523013);
        pa.setLat(40.019806);
        pa.setAddress("北京市朝阳区崔各庄镇太利花园");
        pa.setFence("116.519794,40.0214;116.520352,40.017883;116.526146,40.018343;116.525717,40.021269;116.525202,40.023996;116.521253,40.023668;116.523571,40.021466");
        pa.setState(PointerAddressService.STATUS_WAIT_ESTIMATE);
        pointerAddressService.createPointerAddress(pa);


        pa = getTmpPointerAddress();
        pa.setLng(116.539364);
        pa.setLat(40.020069);
        pa.setAddress("北京市朝阳区崔各庄镇朝林科技园");
        //pa.setFence("116.536961,40.022353;116.537347,40.017916;116.544471,40.017883;116.544943,40.022583;116.54181,40.024128;116.541209,40.021959;116.541209,40.021959");
        pa.setFence("116.536961,40.022353;116.537347,40.017916;116.544471,40.017883;116.544943,40.022583;116.54181,40.024128;116.541209,40.021959");
        pa.setState(PointerAddressService.STATUS_NOT_ESTIMATE);
        pointerAddressService.createPointerAddress(pa);

        pa = getTmpPointerAddress();
        pa.setLng(116.533873);
        pa.setLat(40.02013);
        pa.setAddress("北京市朝阳区崔各庄镇首都机场辅路");
        pa.setFence("116.531598,40.022266;116.531384,40.018027;116.53619,40.018881;116.536319,40.019407");
        pa.setState(PointerAddressService.STATUS_NOT_ESTIMATE);
        pointerAddressService.createPointerAddress(pa);


        pa = getTmpPointerAddress();
        pa.setLng(116.536319);
        pa.setLat(40.009661);
        pa.setAddress("北京市朝阳区金盏镇长店大街62");
        pa.setFence("116.534087,40.011222;116.535933,40.008231;116.538443,40.008149;116.539752,40.011288");
        pa.setState(PointerAddressService.STATUS_NOT_ESTIMATE);
        pointerAddressService.createPointerAddress(pa);


        pa = getTmpPointerAddress();
        pa.setLng(116.534987);
        pa.setLat(40.015172);
        pa.setAddress("北京市朝阳区崔各庄镇北京国际航空俱乐部");
        pa.setState(PointerAddressService.STATUS_NOT_ESTIMATE);
        pointerAddressService.createPointerAddress(pa);


        EstimateTask estimateTask = new EstimateTask();
        estimateTask.setPointerAddressId(pa.getId());
        estimateTask.setDistance(55000);
        estimateTask.setExecState(EstimateTaskService.EXEC_STATUS_NULL);
        estimateTask.setObserveId("observerId");
        estimateTaskService.createEstimate(estimateTask);

        PointerAddress pointerAddress = pointerAddressService.queryPointerAddress(estimateTask.getPointerAddressId());
        Assert.assertEquals(PointerAddressService.STATUS_WAIT_ESTIMATE , pointerAddress.getState());


        List<ObserverPointData> observerPointList = new ArrayList<>();
        ObserverPointData opd = new ObserverPointData();
        opd.setLng(116.542926);
        opd.setLat(40.008762);
        observerPointList.add(opd);
        opd = new ObserverPointData();
        opd.setLng(116.527777);
        opd.setLat(40.010274);
        observerPointList.add(opd);
        opd = new ObserverPointData();
        opd.setLng(116.523013);
        opd.setLat(40.019806);
        observerPointList.add(opd);
        opd = new ObserverPointData();
        opd.setLng(116.539364);
        opd.setLat(40.020069);
        observerPointList.add(opd);
        opd = new ObserverPointData();
        opd.setLng(116.533873);
        opd.setLat(40.02013);
        observerPointList.add(opd);

        Mockito.when(observePointService.getObserveData(any())).thenReturn(observerPointList);
        estimateTaskService.execCalculateFence(estimateTask);

        EstimateTask estimateTask1 = estimateTaskService.getById(estimateTask.getId());
        Assert.assertEquals(EstimateTaskService.EXEC_STATUS_CALCULATED_FENCE , EstimateTaskService.EXEC_STATUS_CALCULATED_FENCE&estimateTask1.getExecState());

        EstimateDataResult edr = estimateTaskService.getEstimateDataResult(estimateTask1.getId());
        System.out.println(edr.getFence());
        Assert.assertNotNull(null , edr.getFence());



        Mockito.when(dataService.getFenceEstimateData(any())).thenReturn(new ArrayList());
        Mockito.when(dataService.getFenceHotData(any())).thenReturn(new ArrayList());
        estimateTaskService.execRequestFenceData(estimateTask1);
        estimateTaskService.execRequestUserFenceHotData(estimateTask1);


        estimateTask1 = estimateTaskService.getById(estimateTask.getId());
        Assert.assertEquals(EstimateTaskService.EXEC_STATUS_REQUESTED_FENCE_DATA , EstimateTaskService.EXEC_STATUS_REQUESTED_FENCE_DATA&estimateTask1.getExecState());
        Assert.assertEquals(EstimateTaskService.EXEC_STATUS_REQUESTED_FENCE_HOT_DATA , EstimateTaskService.EXEC_STATUS_REQUESTED_FENCE_HOT_DATA&estimateTask1.getExecState());
        Assert.assertEquals(EstimateTaskService.EXEC_STATUS_FINISH_CODE , estimateTask1.getExecState().intValue());

        pointerAddress = pointerAddressService.queryPointerAddress(estimateTask.getPointerAddressId());
        Assert.assertEquals(PointerAddressService.STATUS_ESTIMATE_FINISH , pointerAddress.getState());
    }

}
