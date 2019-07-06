package com.mn.modules.api.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.mn.modules.api.controller.CategroyLabelController;
import com.mn.modules.api.dao.EstimateDataResultDao;
import com.mn.modules.api.dao.EstimateTaskDao;
import com.mn.modules.api.dao.PointerAddressDao;
import com.mn.modules.api.entity.EstimateDataResult;
import com.mn.modules.api.entity.EstimateTask;
import com.mn.modules.api.entity.PointerAddress;
import com.mn.modules.api.qo.PointerAddressQuery;
import com.mn.modules.api.remote.DataService;
import com.mn.modules.api.remote.ObservePointService;
import com.mn.modules.api.service.EstimateTaskService;
import com.mn.modules.api.service.PointerAddressService;
import com.mn.modules.api.utils.GeometryUtil;
import com.mn.modules.api.utils.LngLat;
import com.mn.modules.api.utils.Melkman;
import com.mn.modules.api.vo.ObserverPointData;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

@Component
public class EstimateTaskServiceImpl extends ServiceImpl<EstimateTaskDao, EstimateTask> implements EstimateTaskService {

    private static Logger logger = LoggerFactory.getLogger(EstimateTaskServiceImpl.class);

    @Autowired
    ObservePointService observePointService;

    @Autowired
    PointerAddressDao pointerAddressDao;

    @Autowired
    EstimateDataResultDao estimateDataResultDao;

    @Autowired
    DataService dataService;


    @Override
    public EstimateTask createEstimate(EstimateTask estimateTask) {
        EstimateDataResult edr = new EstimateDataResult();
        estimateDataResultDao.insert(edr);
        estimateTask.setResultDataId(edr.getId());
        this.baseMapper.insert(estimateTask);
        return estimateTask;
    }


    @Override
    public EstimateTask getEstimateTaskWithPointerAddressId(String pointerAddressId) {

        logger.debug("getEstimateTaskWithPointerAddressId pointerAddress id {}", pointerAddressId);
        QueryWrapper<EstimateTask> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("pointer_address_id", pointerAddressId);
        queryWrapper.eq("state", STATUS_COMMITED);
        List<EstimateTask> ret = this.baseMapper.selectList(queryWrapper);
        if (ret != null && ret.size() > 0) {
            return ret.get(0);
        }
        return null;
    }

    @Override
    public void invalid(EstimateTask task) {
        task.setState(STATUS_INVALID);
        this.baseMapper.updateById(task);
    }

    @Override
    public void execCalculateFence(EstimateTask task) {

        //通过到访数据过滤出命中的点址围栏
        List<List<LngLat>> filteredFenceData = getThroughFences(task);
        List<LngLat> fence = getFinallyFence((filteredFenceData));
        //计算完毕后，将数据写入结果对象，并更新
        String resultDataId = task.getResultDataId();
        EstimateDataResult edr = new EstimateDataResult();
        edr.setFence(fence.toString());
        edr.setId(resultDataId);
        estimateDataResultDao.updateById(edr);

        task.setExecState(task.getExecState() | EXEC_STATUS_CALCULATED_FENCE);
        this.baseMapper.updateById(task);

        updatePointerAddressStateIfNeed(task);
    }


    /**
     * 得到到访围栏数据
     *
     * @param task
     * @return
     */
    private List<List<LngLat>> getThroughFences(EstimateTask task) {
        //测控点id
        String observerId = task.getObserveId();
        //获取测试点数据
        List<ObserverPointData> observerPointDatas = observePointService.getObserveData(observerId);
        if(observerPointDatas==null || observerPointDatas.size()==0){
            //如果没有到放数据，则不需要处理
            return new ArrayList<>();
        }
        //获取中心点，当前使用待评估的地址的经纬度
        PointerAddress pa = pointerAddressDao.selectById(task.getPointerAddressId());
        Double lng = pa.getLng();
        Double lat = pa.getLat();
        Double distance = task.getDistance();

        //查询所有的辐射距离的点址
        IPage page = new Page(1, 1000000);
        PointerAddressQuery paq = new PointerAddressQuery();
        String filterLabels = task.getFilterLabels();
        if (!"".equals(filterLabels) && filterLabels != null) {
            paq.setLabels(filterLabels);
        }
        paq.setLat(String.valueOf(lat));
        paq.setLng(String.valueOf(lng));
        paq.setDistance(distance);

        IPage<PointerAddress> pageList = pointerAddressDao.queryPointerAddressList(page, paq, null);
        if (pageList.getTotal() <= 0) {
            return new ArrayList<>();
        }

        List<PointerAddress> paList = pageList.getRecords();
        List<List<LngLat>> fances = new ArrayList<>();
        paList.forEach((pointerAddress) -> {
            //点址围栏数据
            String fence = pointerAddress.getFence();
            if (!"".equals(fence) && fence != null) {
                //进行对象装换
                String[] lnglatStrings = fence.split(";");
                List<LngLat> fencePoints = new ArrayList<>();
                for (String lnglatString : lnglatStrings) {
                    String[] lnglat = lnglatString.split(",");
                    Double _lng = Double.parseDouble(lnglat[0]);
                    Double _lat = Double.parseDouble(lnglat[1]);
                    LngLat ll = new LngLat();
                    ll.setLat(_lat);
                    ll.setLng(_lng);
                    fencePoints.add(ll);
                }
                if (fencePoints.size() >= 3) {
                    fances.add(fencePoints);
                }
            }
        });

        //将转换后的

        List<List<LngLat>> ret = new ArrayList<>();
        if (observerPointDatas == null || observerPointDatas.size() == 0) {
            return ret;
        }

        observerPointDatas.forEach((observerPoint) -> {
            fances.forEach((target) -> {
                LngLat lnglat = new LngLat();
                lnglat.setLat(observerPoint.getLat());
                lnglat.setLng(observerPoint.getLng());
                //判断到访点是否在围栏中
                boolean isIn = GeometryUtil.isPtInPoly(lnglat , target);
                if(isIn){
                    throw new RuntimeException("no impl");
                }
            });
        });

        return ret;

    }

    /**
     * 通过凸算法获取最终的围栏点数据
     * @param  fences 围栏列表
     * @return
     */
    private List<LngLat> getFinallyFence(List<List<LngLat>> fences) {
         if(fences == null || fences.size()==0){
              return new ArrayList<>();
         }
         List<LngLat> ret = new ArrayList<>();
         fences.forEach((fence)->{
              if(fence == null || fence.size()==0) {
                  return;
              }
              fence.forEach((lnglat)->{
                  ret.add(lnglat);
              });
         });
         Melkman melkman = new Melkman(ret);
         LngLat[] finallyFence =  melkman.getTubaoPoint();
         return Arrays.asList(finallyFence);
    }

    @Override
    public void execRequestFenceData(EstimateTask task) {
        List<List<LngLat>> filteredFenceData = getThroughFences(task);
        dataService.getFenceEstimateData(filteredFenceData);

        task.setExecState(task.getExecState() | EXEC_STATUS_REQUESTED_FENCE_DATA);
        this.baseMapper.updateById(task);
        updatePointerAddressStateIfNeed(task);
    }

    @Override
    public void execRequestUserFenceHotData(EstimateTask task) {

        task.setExecState(task.getExecState() | EXEC_STATUS_REQUESTED_FENCE_HOT_DATA);
        this.baseMapper.updateById(task);
        updatePointerAddressStateIfNeed(task);
    }

    private void updatePointerAddressStateIfNeed(EstimateTask task) {
        Integer execState = task.getExecState();
        if (execState == EXEC_STATUS_FINISH_CODE) {
            PointerAddress pa = pointerAddressDao.selectById(task.getPointerAddressId());
            pa.setState(PointerAddressService.STATUS_ESTIMATE_FINISH);
            pointerAddressDao.updateById(pa);
        }
    }
}

