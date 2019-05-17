package com.mn.modules.api.service.impl;

import com.mn.modules.api.dao.ChancePointDao;
import com.mn.modules.api.entity.ChancePoint;
import com.mn.modules.api.service.ChancePointService;
import com.mn.modules.api.vo.EstimateResult;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

@Service
public class ChancePointServiceImpl implements ChancePointService {

    private Logger logger = LoggerFactory.getLogger(ChancePointServiceImpl.class);


    @Autowired
    private ChancePointDao chancePointDao;

    @Autowired
    private RestTemplate restTemplate;


    public ChancePointServiceImpl(){}

    /**
     * @param chancePointDao
     */
    public ChancePointServiceImpl(ChancePointDao chancePointDao , RestTemplate restTemplate) {
        this.chancePointDao = chancePointDao;
        this.restTemplate = restTemplate;
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

