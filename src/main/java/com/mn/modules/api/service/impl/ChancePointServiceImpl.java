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
    public IPage<ChancePoint> getChancePointList(String scope, String adCode, String appId, IPage pageParam , String userAccount) {
        QueryWrapper<ChancePoint> queryWrapper = new QueryWrapper<>();

        queryWrapper.eq("appId", appId);
        if (AREA_SCOPE_PROVINCE.equals(scope)) {
            queryWrapper.eq("province", adCode);
        } else if (AREA_SCOPE_CITY.equals(scope)) {
            queryWrapper.eq("city", adCode);
        } else if (AREA_SCOPE_DISTRICT.equals(scope)) {
            queryWrapper.eq("district", adCode);
        }
        IPage page =  chancePointDao.selectPage(pageParam, queryWrapper);
        List<ChancePoint> records = page.getRecords();
        if(records.size()==0){
             return page;
        }

        List<ChancePoint> newrecords =  new ArrayList<>();
        records.forEach((record)->{
             if(record.getShopId() ==null){
                 String shopId =  shopService.getChancePointShopId(userAccount , record);
                 if(shopId != null){
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

//        QueryWrapper<EstimateResultData> query = new QueryWrapper<>();
//        query.eq("chance_id" , chancePoint.getId());
//        EstimateResultData estimateResultData =  estimateResultDataDao.selectOne(query);
//        if(estimateResultData!=null){
//            //这里需要转换为 List<EstimateResult> 对象
//        }

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
            //商圈活跃度
            Quota circleActive = chancePointEstimateService.getBusinessCircleActive(userAccount, chancePoint, new Date());
            //商圈活跃度Top榜
            //Quota circleActiveTop = chancePointEstimateService.getBusinessCircleActiveTop(userAccount, chancePoint, new Date());
            if(circlePopulation != null){
                circleEstimateResult.add(circlePopulation);
            }
            if(circleActive != null){
                circleEstimateResult.add(circleActive);
            }
//            if(circleActiveTop != null){
//                circleEstimateResult.add(circleActiveTop);
//            }

            result.add(circleEstimateResult);
            //商区评估
            EstimateResult districtEstimateResult = new EstimateResult();
            districtEstimateResult.setLabel("商区评估");
            //商区人口体量
            Quota districtPopulation = chancePointEstimateService.getBusinessDistrictPopulation(userAccount, chancePoint, new Date());
            //商区活跃度
            Quota districtActive = chancePointEstimateService.getBusinessDistrictActive(userAccount, chancePoint, new Date());
            //商区活跃度Top
            //Quota districtActiveTop = chancePointEstimateService.getBusinessDistrictActiveTop(userAccount, chancePoint, new Date());
            //商区公交路线数量、公交站点数
            Quota districtBusNum = chancePointEstimateService.getBusinessDistrictBusNum(userAccount, chancePoint, new Date());
            //消费者活跃度
            Quota districtCustomerActive = chancePointEstimateService.getBusinessDistrictCustomerActive(userAccount, chancePoint, new Date());
            //商区消费者有子女占比
            Quota districtCustomerChildrenProportion = chancePointEstimateService.getBusinessDistrictCustomerChildrenProportion(userAccount, chancePoint, new Date());
            //商区关键配套
            Quota districtMating = chancePointEstimateService.getBusinessDistrictMating(userAccount, chancePoint, new Date());
            //商区关键配套Top榜
            //Quota districtMatingTop = chancePointEstimateService.getBusinessDistrictMatingTop(userAccount, chancePoint, new Date());
            // 商区交路线数量、公交站点Top榜
            //Quota districtBusTop = chancePointEstimateService.getBusinessDistrictBusTop(userAccount, chancePoint, new Date());
            if(districtPopulation != null){
                districtEstimateResult.add(districtPopulation);
            }
            if(districtActive !=null){
                districtEstimateResult.add(districtActive);
            }
//            if(districtActiveTop != null){
//                districtEstimateResult.add(districtActiveTop);
//            }

            if(districtBusNum != null){
                districtEstimateResult.add(districtBusNum);
            }
//            if(districtBusTop != null){
//                districtEstimateResult.add(districtBusTop);
//            }
            if(districtCustomerActive != null){
                districtEstimateResult.add(districtCustomerActive);
            }
            if(districtCustomerChildrenProportion!=null){
                districtEstimateResult.add(districtCustomerChildrenProportion);
            }
            if(districtMating!=null){
                districtEstimateResult.add(districtMating);
            }
//            if(districtMatingTop !=null){
//                districtEstimateResult.add(districtMatingTop);
//            }
            result.add(districtEstimateResult);
            //街道评估
            EstimateResult streeEstimateResult = new EstimateResult();
            streeEstimateResult.setLabel("街道评估");
            //街道关键配套
            Quota streetMating = chancePointEstimateService.getStreetMating(userAccount, chancePoint, new Date());
//            Quota streetTop = chancePointEstimateService.getStreetTop(userAccount, chancePoint, new Date());
            if(streetMating!=null){
                streeEstimateResult.add(streetMating);
            }
//            if(streetTop != null){
//                streeEstimateResult.add(streetTop);
//            }
            result.add(streeEstimateResult);
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
}

