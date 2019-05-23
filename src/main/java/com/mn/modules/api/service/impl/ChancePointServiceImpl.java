package com.mn.modules.api.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.mn.modules.api.dao.ChancePointDao;
import com.mn.modules.api.dao.EstimateResultDataDao;
import com.mn.modules.api.entity.AnalysisResult;
import com.mn.modules.api.entity.ChancePoint;
import com.mn.modules.api.remote.ChancePointEstimateService;
import com.mn.modules.api.remote.ShopService;
import com.mn.modules.api.service.ChancePointService;
import com.mn.modules.api.vo.EstimateResult;
import com.mn.modules.api.vo.Quota;
import com.mn.modules.api.vo.QuotaItem;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Service
public class ChancePointServiceImpl implements ChancePointService {

    private Logger logger = LoggerFactory.getLogger(ChancePointServiceImpl.class);


    @Autowired
    private ChancePointDao chancePointDao;

    @Autowired
    private EstimateResultDataDao estimateResultDataDao;


    @Autowired
    private ChancePointEstimateService chancePointEstimateService;

    @Autowired
    private ShopService shopService;


    public ChancePointServiceImpl() {
    }

    public ChancePointServiceImpl(ChancePointDao chancePointDao, EstimateResultDataDao estimateResultDataDao,
                                  ChancePointEstimateService chancePointEstimateService, ShopService shopService) {
        this.chancePointDao = chancePointDao;
        this.estimateResultDataDao = estimateResultDataDao;
        this.chancePointEstimateService = chancePointEstimateService;
        this.shopService = shopService;
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
    public IPage<ChancePoint> getChancePointList(String scope, String adCode, String appId, IPage pageParam, String userAccount) {
        QueryWrapper<ChancePoint> queryWrapper = new QueryWrapper<>();

        queryWrapper.eq("appId", appId);
        //无效状态的不显示
        queryWrapper.ne("status" , CHANCE_STATUS_INVALID);
        if (AREA_SCOPE_PROVINCE.equals(scope)) {
            queryWrapper.eq("province", adCode);
        } else if (AREA_SCOPE_CITY.equals(scope)) {
            queryWrapper.eq("city", adCode);
        } else if (AREA_SCOPE_DISTRICT.equals(scope)) {
            queryWrapper.eq("district", adCode);
        }
        IPage page = chancePointDao.selectPage(pageParam, queryWrapper);

        List<ChancePoint> records = page.getRecords();
        if (records.size() == 0) {
            return page;
        }
        List<ChancePoint> newrecords = new ArrayList<>();
        records.forEach((record) -> {
            if (record.getShopId() == null) {
                String shopId = shopService.getChancePointShopId(userAccount, record);
                if (shopId != null) {
                    record.setShopId(shopId);
                    chancePointDao.updateById(record);
                }
            }
            newrecords.add(record);
        });

        page.setRecords(newrecords);
        return page;
    }


    @Override
    public List<EstimateResult> getChanceEstimateResult(ChancePoint chancePoint, String userAccount, Date data) {


        //如果shopid为null 则需要先获取shopid
        if (chancePoint.getShopId() == null) {
            String shopId = shopService.getChancePointShopId(userAccount, chancePoint);
            if (shopId == null) {
                return null;
            } else {
                //更新
                ChancePoint updateChancePoint = new ChancePoint();
                updateChancePoint.setShopId(shopId);
                chancePointDao.updateById(updateChancePoint);
                chancePoint.setShopId(shopId);
            }
        }

        List<EstimateResult> result = new ArrayList<>();
        if (chancePoint.getShopId() != null && !"".equals(chancePoint.getShopId())) {
            //商圈评估
            //商圈人口体量.
            EstimateResult circleEstimateResult = new EstimateResult();
            circleEstimateResult.setLabel("商圈评估");
            Quota circlePopulation = chancePointEstimateService.getBusinessCirclePopulation(userAccount, chancePoint, new Date());
            circlePopulation.setRuleName("circlePopulation");
            //商圈活跃度
            Quota circleActive = chancePointEstimateService.getBusinessCircleActive(userAccount, chancePoint, new Date());
            circleActive.setRuleName("circleActive");

            Quota circleCreateYear = new Quota();
            circleCreateYear.setLabel("商圈形成年限");
            circleCreateYear.setRemark("主要商业设施、居民小区建成时间");
            circleCreateYear.setValues(new ArrayList<>());
            circleCreateYear.setRuleName("circleCreateYear");
            circleEstimateResult.add(circleCreateYear);

            Quota circleDevelopingTrend = new Quota();
            circleDevelopingTrend.setLabel("商圈发展趋势");
            circleDevelopingTrend.setRemark("政府发展规划");
            circleDevelopingTrend.setValues(new ArrayList<>());
            circleDevelopingTrend.setRuleName("circleDevelopingTrend");
            circleEstimateResult.add(circleDevelopingTrend);


            if (circlePopulation != null) {
                circleEstimateResult.add(circlePopulation);
            }
            if (circleActive != null) {
                circleEstimateResult.add(circleActive);
            }
            result.add(circleEstimateResult);

            //商区评估
            EstimateResult districtEstimateResult = new EstimateResult();
            districtEstimateResult.setLabel("商区评估");
            //商区人口体量
            Quota districtPopulation = chancePointEstimateService.getBusinessDistrictPopulation(userAccount, chancePoint, new Date());
            districtPopulation.setRuleName("districtPopulation");
            //政府规划3年内小区人口体量
            Quota districtPopulationIn3Year = new Quota();
            districtPopulationIn3Year.setLabel("政府规划3年内小区人口体量");
            districtPopulationIn3Year.setRemark("市政府规划数据");
            districtPopulationIn3Year.setValues(new ArrayList<>());
            districtPopulationIn3Year.setRuleName("districtPopulationIn3Year");
            districtEstimateResult.add(districtPopulationIn3Year);
            //商区当前人口活跃度（入住率）
            Quota districtPopulationActive = new Quota();
            districtPopulationActive.setLabel("商区当前人口活跃度-入住率");
            districtPopulationActive.setRemark("周边主要小区的平均入住率");
            districtPopulationActive.setValues(new ArrayList<>());
            districtPopulationActive.setRuleName("districtPopulationActive");
            districtEstimateResult.add(districtPopulationActive);
            //商区活跃度
            Quota districtActive = chancePointEstimateService.getBusinessDistrictActive(userAccount, chancePoint, new Date());
            districtActive.setRuleName("districtActive");
            //商区公交路线数量、公交站点数
            Quota districtBusNum = chancePointEstimateService.getBusinessDistrictBusNum(userAccount, chancePoint, new Date());
            //需要将路线数量、公交站数拆分为两个指标
            List<QuotaItem> items = districtBusNum.getValues();
            if(items != null && items.size()>0){
                items.forEach((item)->{
                    if("公交线".equals(item.getLabel())){
                        Quota districtBusLineNum = new Quota();
                        districtBusLineNum.setLabel("商区公交路线数量");
                        districtBusLineNum.setRemark("方圆500m内的交通枢纽数量");
                        districtBusLineNum.add(item);
                        districtBusLineNum.setRuleName("districtBusLineNum");
                        districtEstimateResult.add(districtBusLineNum);
                    }else if("公交站".equals(item.getLabel())){
                        Quota districtBusStopNum = new Quota();
                        districtBusStopNum.setLabel("商区公交路线数量");
                        districtBusStopNum.setRemark("以500m为半径");
                        districtBusStopNum.add(item);
                        districtBusStopNum.setRuleName("districtBusStopNum");
                        districtEstimateResult.add(districtBusStopNum);
                    }
                });
            }

            //消费者活跃度
            Quota districtCustomerActive = chancePointEstimateService.getBusinessDistrictCustomerActive(userAccount, chancePoint, new Date());
            districtCustomerActive.setRuleName("districtCustomerActive");
            //商区消费者有子女占比
            Quota districtCustomerChildrenProportion = chancePointEstimateService.getBusinessDistrictCustomerChildrenProportion(userAccount, chancePoint, new Date());
            districtCustomerChildrenProportion.setRuleName("districtCustomerChildrenProportion");
            //商区关键配套
            Quota districtMating = chancePointEstimateService.getBusinessDistrictMating(userAccount, chancePoint, new Date());
            districtMating.setRuleName("districtMating");
            //商区定位
            Quota districtLevel = new Quota();
            districtLevel.setLabel("商区定位");
            districtLevel.setRemark("是否是城市核心商区");
            districtLevel.setValues(new ArrayList<>());
            districtLevel.setRuleName("districtLevel");
            districtEstimateResult.add(districtLevel);

            if (districtPopulation != null) {
                districtEstimateResult.add(districtPopulation);
            }
            if (districtActive != null) {
                districtEstimateResult.add(districtActive);
            }
            if (districtCustomerActive != null) {
                districtEstimateResult.add(districtCustomerActive);
            }
            if (districtCustomerChildrenProportion != null) {
                districtEstimateResult.add(districtCustomerChildrenProportion);
            }
            if (districtMating != null) {
                districtEstimateResult.add(districtMating);
            }

            result.add(districtEstimateResult);

            //街道评估
            EstimateResult streeEstimateResult = new EstimateResult();
            streeEstimateResult.setLabel("街道评估");
            //街道关键配套
            Quota streetMating = chancePointEstimateService.getStreetMating(userAccount, chancePoint, new Date());
            streetMating.setRuleName("streetMating");
            if (streetMating != null) {
                streeEstimateResult.add(streetMating);

            }
            //落位街道主路口客流
            Quota districtMainRoadRate = new Quota();
            districtMainRoadRate.setLabel("落位街道主路口客流");
            districtMainRoadRate.setRemark("日均客流");
            districtMainRoadRate.setValues(new ArrayList<>());
            districtMainRoadRate.setRuleName("districtMainRoadRate");
            streeEstimateResult.add(districtMainRoadRate);

            result.add(streeEstimateResult);

            //席位评估
            EstimateResult seatEstimateResult = new EstimateResult();
            seatEstimateResult.setLabel("席位评估");
            seatEstimateResult.setType("seatEstimateResult");

            Quota seatDayPersonFlow = new Quota();
            seatDayPersonFlow.setLabel("席位日均客流");
            seatDayPersonFlow.setRemark ("");
            seatDayPersonFlow.setRuleName("seatDayPersonFlow");
            seatEstimateResult.add(seatDayPersonFlow);

            Quota seatPositionFlow = new Quota();
            seatPositionFlow.setLabel("落位位置-是否人流同侧");
            seatPositionFlow.setRemark ("主干道人流方向，适用于双向4车道以上街道");
            seatPositionFlow.setRuleName("seatPositionFlow");
            seatEstimateResult.add(seatPositionFlow);

            Quota seatPositionDistance = new Quota();
            seatPositionDistance.setLabel("落位位置-主路口距离");
            seatPositionDistance.setRemark ("落位与街道两边路口距离");
            seatPositionDistance.setRuleName("seatPositionDistance");
            seatEstimateResult.add(seatPositionDistance);

            Quota seatDoorHeaderLen = new Quota();
            seatDoorHeaderLen.setLabel("门头长度(米)");
            seatDoorHeaderLen.setRemark ("");
            seatDoorHeaderLen.setRuleName("seatDoorheaderLen");
            seatEstimateResult.add(seatDoorHeaderLen);

            Quota seatLeaseTerm = new Quota();
            seatLeaseTerm.setLabel("签约年限");
            seatLeaseTerm.setRemark ("");
            seatLeaseTerm.setRuleName("seatLeaseTerm");
            seatEstimateResult.add(seatLeaseTerm);

            result.add(seatEstimateResult);

            //席位评估
            EstimateResult competitorEstimateResult = new EstimateResult();
            competitorEstimateResult.setLabel("竞品分布");
            competitorEstimateResult.setType("competitorEstimateResult");

            Quota competitorNum = new Quota();
            competitorNum.setLabel("竞品店数量");
            competitorNum.setRemark ("1km内竞品店面数量");
            competitorNum.setRuleName("competitorNum");
            competitorEstimateResult.add(competitorNum);

            Quota competitorDistance = new Quota();
            competitorDistance.setLabel("最近竞品距离(米)");
            competitorDistance.setRemark ("单位米");
            competitorDistance.setRuleName("competitorDistance");
            competitorEstimateResult.add(competitorDistance);


            result.add(competitorEstimateResult);

            return result;
        }
        return null;
    }


    @Override
    public ChancePoint queryChance(String id) {
        return chancePointDao.selectById(id);
    }

    @Override
    public void analysis(ChancePoint chancePoint, List<EstimateResult> estimateResultList) {

    }

    @Override
    public List<AnalysisResult> analysisHistory(ChancePoint chancePoint) {
        return null;
    }

    @Override
    public boolean invalidChancePoint(String id) {
        ChancePoint cp =  new ChancePoint();
        cp.setStatus(CHANCE_STATUS_INVALID);
        cp.setId(id);
        chancePointDao.updateById(cp);
        return true;
    }
}

