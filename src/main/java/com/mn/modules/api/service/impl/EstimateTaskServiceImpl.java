package com.mn.modules.api.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
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
import com.mn.modules.api.vo.ObserverPointData;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class EstimateTaskServiceImpl extends ServiceImpl<EstimateTaskDao, EstimateTask> implements EstimateTaskService {


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
        QueryWrapper<EstimateTask> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("pointer_address_id", pointerAddressId);
        queryWrapper.eq("state", STATUS_COMMITED);
        List<EstimateTask> ret = this.baseMapper.selectList(queryWrapper);
        return ret.get(0);
    }

    @Override
    public void invalid(EstimateTask task) {
        task.setState(STATUS_INVALID);
        this.baseMapper.updateById(task);
    }

    @Override
    public void execCalculateFence(EstimateTask task) {

        //通过到访数据过滤出命中的点址围栏
        List<Double[]> filteredFenceData = filterFences(task);
        Double[] fence = getFinallyFence((filteredFenceData));

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
     * 得到围栏数据
     *
     * @param task
     * @return
     */
    private List<Double[]> filterFences(EstimateTask task) {
        //测控点id
        String observerId = task.getObserveId();
        //获取测试点数据
        List<ObserverPointData> opd = observePointService.getObserveData(observerId);
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

        IPage<PointerAddress> paList = pointerAddressDao.queryPointerAddressList(page, paq, null);

        throw new RuntimeException("no imple");
    }

    /**
     * 通过凸算法获取最终的围栏点数据
     * @return
     */
    private Double[]  getFinallyFence(List<Double[]> fences) {
        throw new RuntimeException("no imple");
    }

    @Override
    public void execRequestFenceData(EstimateTask task) {
        List<Double[]> filteredFenceData = filterFences(task);
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

    private void updatePointerAddressStateIfNeed(EstimateTask task){
         Integer execState = task.getExecState();
         if(execState == EXEC_STATUS_FINISH_CODE){
             PointerAddress pa = pointerAddressDao.selectById(task.getPointerAddressId());
             pa.setState(PointerAddressService.STATUS_ESTIMATE_FINISH);
             pointerAddressDao.updateById(pa);
         }
    }
}

