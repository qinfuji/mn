package com.mn.modules.api.service.impl;

import com.mn.modules.api.dao.ChancePointDao;
import com.mn.modules.api.entity.ChancePoint;
import com.mn.modules.api.remote.ChancePointEstimateService;
import com.mn.modules.api.service.ChancePointService;
import com.mn.modules.api.vo.EstimateResult;
import com.mn.modules.api.vo.Quota;
import com.sun.org.apache.xpath.internal.operations.Quo;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Service
public class ChancePointServiceImpl implements ChancePointService {

    private Logger logger = LoggerFactory.getLogger(ChancePointServiceImpl.class);


    @Autowired
    private ChancePointDao chancePointDao;


    @Autowired
    private ChancePointEstimateService chancePointEstimateService;


    public ChancePointServiceImpl(){}

    public ChancePointServiceImpl(ChancePointDao chancePointDao, ChancePointEstimateService chancePointEstimateService) {
        this.chancePointDao = chancePointDao;
        this.chancePointEstimateService = chancePointEstimateService;
    }

    @Override
    public ChancePoint createChancePoint(ChancePoint chancePoint) {
        chancePointDao.insert(chancePoint);
        return chancePoint;
    }

    @Override
    public ChancePoint updateChancePoint(ChancePoint chancePoint) {
        chancePointDao.updateById(chancePoint);
        return chancePoint;
    }

    @Override
    public List<ChancePoint> getChancePoint(String scope, String adCode, String appId) {
        return null;
    }

    @Override
    public List<ChancePoint> getChancePointByLnglat(BigDecimal lng, BigDecimal lat, int radius, String appId) {
        return null;
    }

    @Override
    public List<EstimateResult> getChanceEstimateResult(ChancePoint chancePoint , String userAccount , Date data) {
        List<EstimateResult> result = new ArrayList<>();
        if(chancePoint.getChanceId()  != null && "".equals(chancePoint.getChanceId())){
            //商圈评估
            //商圈人口体量.
            EstimateResult circleEstimateResult = new EstimateResult();
            circleEstimateResult.setLabel("商圈评估");
            Quota circlePopulation =  chancePointEstimateService.getBusinessCirclePopulation(userAccount , chancePoint , new Date());
            //商圈活跃度
            Quota circleActive = chancePointEstimateService.getBusinessCircleActive(userAccount,chancePoint,new Date());
            //商圈活跃度Top榜
            Quota circleActiveTop = chancePointEstimateService.getBusinessCircleActiveTop(userAccount,chancePoint,new Date());
            circleEstimateResult.add(circlePopulation);
            circleEstimateResult.add(circleActive);
            circleEstimateResult.add(circleActiveTop);
            result.add(circleEstimateResult);
            //商区评估
            EstimateResult districtEstimateResult = new EstimateResult();
            districtEstimateResult.setLabel("商区评估");
            //商区人口体量
            Quota districtPopulation = chancePointEstimateService.getBusinessDistrictPopulation(userAccount,chancePoint,new Date());
            //商区活跃度
            Quota districtActive = chancePointEstimateService.getBusinessDistrictActive(userAccount,chancePoint,new Date());
            //商区活跃度Top
            Quota districtActiveTop = chancePointEstimateService.getBusinessDistrictActiveTop(userAccount,chancePoint,new Date());
            //商区公交路线数量、公交站点数
            Quota districtBusNum = chancePointEstimateService.getBusinessDistrictBusNum(userAccount,chancePoint,new Date());
            //消费者活跃度
            Quota districtCustomerActive = chancePointEstimateService.getBusinessDistrictCustomerActive(userAccount,chancePoint,new Date());
            //商区消费者有子女占比
            Quota districtCustomerChildrenProportion = chancePointEstimateService.getBusinessDistrictCustomerChildrenProportion(userAccount,chancePoint,new Date());
            //商区关键配套
            Quota districtMating = chancePointEstimateService.getBusinessDistrictMating(userAccount,chancePoint,new Date());
            //商区关键配套Top榜
            Quota districtMatingTop = chancePointEstimateService.getBusinessDistrictMatingTop(userAccount,chancePoint,new Date());
            // 商区交路线数量、公交站点Top榜
            Quota districtBusTop = chancePointEstimateService.getBusinessDistrictBusTop(userAccount,chancePoint,new Date());
            districtEstimateResult.add(districtPopulation);
            districtEstimateResult.add(districtActive);
            districtEstimateResult.add(districtActiveTop);
            districtEstimateResult.add(districtBusNum);
            districtEstimateResult.add(districtBusTop);
            districtEstimateResult.add(districtCustomerActive);
            districtEstimateResult.add(districtCustomerChildrenProportion);
            districtEstimateResult.add(districtMating);
            districtEstimateResult.add(districtMatingTop);
            result.add(districtEstimateResult);
            //街道评估
            EstimateResult streeEstimateResult = new EstimateResult();
            streeEstimateResult.setLabel("街道评估");
            //街道关键配套
            Quota streetMating = chancePointEstimateService.getStreetMating(userAccount,chancePoint,new Date());
            Quota streetTop = chancePointEstimateService.getStreetTop(userAccount,chancePoint,new Date());
            streeEstimateResult.add(streetMating);
            streeEstimateResult.add(streetTop);
            result.add(streeEstimateResult);
            return result;
        }
        return null;
    }

    @Override
    public void analysis(ChancePoint chancePoint, List<EstimateResult> estimateResultList) {

    }

    @Override
    public List<?> analysisHistory(ChancePoint chancePoint) {
        return null;
    }
}

