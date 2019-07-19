package com.mn.modules.api.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.mn.modules.api.controller.CategroyLabelController;
import com.mn.modules.api.dao.EstimateDataResultDao;
import com.mn.modules.api.dao.EstimateTaskDao;
import com.mn.modules.api.dao.PointerAddressDao;
import com.mn.modules.api.dao.SharePointerAddressDao;
import com.mn.modules.api.entity.EstimateDataResult;
import com.mn.modules.api.entity.EstimateTask;
import com.mn.modules.api.entity.PointerAddress;
import com.mn.modules.api.entity.SharePointerAddress;
import com.mn.modules.api.qo.PointerAddressQuery;
import com.mn.modules.api.remote.DataService;
import com.mn.modules.api.remote.ObservePointService;
import com.mn.modules.api.service.EstimateTaskService;
import com.mn.modules.api.service.PointerAddressService;
import com.mn.modules.api.utils.GeometryUtil;
import com.mn.modules.api.utils.LngLat;
import com.mn.modules.api.utils.Melkman;
import com.mn.modules.api.vo.ObserverPointData;
import de.lmu.ifi.dbs.elki.data.spatial.Polygon;
import de.lmu.ifi.dbs.elki.math.geometry.AlphaShape;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Component
@Transactional
public class EstimateTaskServiceImpl extends ServiceImpl<EstimateTaskDao, EstimateTask> implements EstimateTaskService {

    private static Logger logger = LoggerFactory.getLogger(EstimateTaskServiceImpl.class);

    @Autowired
    ObservePointService observePointService;

    @Autowired
    PointerAddressDao pointerAddressDao;

    @Autowired
    EstimateDataResultDao estimateDataResultDao;


    @Autowired
    SharePointerAddressDao sharePointerAddressDao;

    @Autowired
    DataService dataService;

    public EstimateTaskServiceImpl() {
    }

    public EstimateTaskServiceImpl(ObservePointService observePointService, EstimateTaskDao estimateTaskDao, SharePointerAddressDao sharePointerAddressDao, PointerAddressDao pointerAddressDao, EstimateDataResultDao estimateDataResultDao, DataService dataService) {
        this.observePointService = observePointService;
        this.pointerAddressDao = pointerAddressDao;
        this.estimateDataResultDao = estimateDataResultDao;
        this.dataService = dataService;
        this.baseMapper = estimateTaskDao;
        this.sharePointerAddressDao = sharePointerAddressDao;
    }

    @Override
    public EstimateTask createEstimate(EstimateTask estimateTask, boolean isSubmit) {

        if (estimateTask.getId() == null) {
            EstimateDataResult edr = new EstimateDataResult();
            estimateDataResultDao.insert(edr);
            estimateTask.setResultDataId(edr.getId());
        }
        //创建任务后需要更新点址的状态
        PointerAddress inDbPa = this.pointerAddressDao.selectById(estimateTask.getPointerAddressId());
        PointerAddress updatePs = new PointerAddress();
        if (isSubmit) {
            updatePs.setState(PointerAddressService.STATUS_WAIT_ESTIMATE);
            estimateTask.setState(EstimateTaskService.STATUS_COMMITED);
            estimateTask.setExecState(EstimateTaskService.EXEC_STATUS_NULL);
        } else {
            updatePs.setState(PointerAddressService.STATUS_WAIT_ESTIMATE_SUBMIT);
            estimateTask.setState(EstimateTaskService.STATUS_WAIT_COMMIT);
        }
        if (estimateTask.getId() == null) {
            this.baseMapper.insert(estimateTask);
        } else {
            this.baseMapper.updateById(estimateTask);
        }

        updatePs.setId(inDbPa.getId());
        updatePs.setVersion(inDbPa.getVersion());
        pointerAddressDao.updateById(updatePs);
        return estimateTask;
    }

    @Override
    public EstimateTask getEstimateTaskWithPointerAddressId(String pointerAddressId) {

        logger.debug("getEstimateTaskWithPointerAddressId pointerAddress id {}", pointerAddressId);
        QueryWrapper<EstimateTask> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("pointer_address_id", pointerAddressId);
        List<EstimateTask> ret = this.baseMapper.selectList(queryWrapper);
        if (ret != null && ret.size() > 0) {
            return ret.get(0);
        }
        return null;
    }

    @Override
    public EstimateDataResult saveConclusion(String emtimateId, EstimateDataResult result) {

        EstimateTask et = this.baseMapper.selectById(emtimateId);
        EstimateDataResult updated = new EstimateDataResult();
        updated.setConclusion(result.getConclusion());
        updated.setEnterDate(result.getEnterDate());
        updated.setBusinessType(result.getBusinessType());
        updated.setId(et.getResultDataId());
        updated.setState(EstimateTaskService.RESULT_DATE_STATUS_SUBMITED);
        estimateDataResultDao.updateById(updated);
        PointerAddress pa = this.pointerAddressDao.selectById(et.getPointerAddressId());
        pa.setState(PointerAddressService.STATUS_ALL_FINISH);
        this.pointerAddressDao.updateById(pa);
        return estimateDataResultDao.selectById(updated.getId());
    }

    @Override
    public EstimateDataResult getEstimateDataResult(String estimateTaskId) {
        EstimateTask ret = this.baseMapper.selectById(estimateTaskId);
        return estimateDataResultDao.selectById(ret.getResultDataId());
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

        String fenceString = "";
        if (fence != null && fence.size() >= 3) {

            for(Iterator<LngLat> iteratror= fence.iterator(); iteratror.hasNext();){
                LngLat lngLat = iteratror.next();
                if (lngLat == null) {
                    continue;
                }
                fenceString += (lngLat.getLng().toString() + "," + lngLat.getLat());
                if(iteratror.hasNext()){
                     fenceString += ";";
                }
            }

        }

        edr.setFence(fenceString);
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
        ObserverPointData observerPointDatas = observePointService.getObserveData(observerId , "");
//        if (observerPointDatas == null || observerPointDatas.size() == 0) {
//            //如果没有到放数据，则不需要处理
//            return new ArrayList<>();
//        }
        //获取中心点，当前使用待评估的地址的经纬度
        PointerAddress pa = pointerAddressDao.selectById(task.getPointerAddressId());
        Double lng = pa.getLng();
        Double lat = pa.getLat();
        Integer distance = task.getDistance();

        //查询所有的辐射距离的公共点址
        PointerAddressQuery paq = new PointerAddressQuery();
        String filterLabels = task.getFilterLabels();
        if (!"".equals(filterLabels) && filterLabels != null) {
            paq.setLabels(filterLabels);
        }
        paq.setLat(String.valueOf(lat));
        paq.setLng(String.valueOf(lng));
        paq.setDistance(distance);
        List<SharePointerAddress> spaList = sharePointerAddressDao.querySharePointerAddressList(paq);

        //竞品店
        List<PointerAddress> competitor = new ArrayList<>();
        if (task.getCompetitorIds() != null && !"".equals(task.getCompetitorIds())) {
            PointerAddressQuery paq1 = new PointerAddressQuery();
            paq1.setCompetitorIds(task.getCompetitorIds());
            competitor = pointerAddressDao.queryPointerAddressList1(paq1, null);
        }


        List<List<LngLat>> fances = new ArrayList<>();
        spaList.forEach((pointerAddress) -> {
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

        competitor.forEach((pointerAddress) -> {
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

//        observerPointDatas.forEach((observerPoint) -> {
//            fances.forEach((target) -> {
//                LngLat lnglat = new LngLat();
//                lnglat.setLat(observerPoint.getLat());
//                lnglat.setLng(observerPoint.getLng());
//                //判断到访点是否在围栏中
//                boolean isIn = GeometryUtil.isPtInPoly(lnglat, target);
//                if (isIn && !ret.contains(target)) {
//                    ret.add(target);
//                }
//            });
//        });

        //TODO 测试用
        fances.forEach((target) -> {

            ret.add(target);

        });

        return ret;
    }

    /**
     * 通过凸算法获取最终的围栏点数据
     *
     * @param fences 围栏列表
     * @return
     */
    private List<LngLat> getFinallyFence(List<List<LngLat>> fences) {
        if (fences == null || fences.size() == 0) {
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

//        List<double[]> t = new ArrayList<>();
//        fences.forEach((fence) -> {
//            if (fence == null || fence.size() == 0) {
//                return;
//            }
//            fence.forEach((lnglat) -> {
//                t.add(new double[]{lnglat.getLng().doubleValue(), lnglat.getLat().doubleValue()});
//            });
//        });

        /**
         * AlphaShape的第二个参数是范围值， 防止凸包的点连接过长，
         * 这个算法当前结合中的点不能相同，在否则会会出现错误。
         * 这个值占时没有想好设置多大，当前设置100基本就与Melkman算法一样了
         */

//        List<Polygon> polys = new AlphaShape(t, 100).compute();
//
//        List<LngLat> alphaShapeRet = new ArrayList<>();
//        if (polys != null && polys.size() > 0) {
//            Polygon poly = polys.get(0);
//            for (int i = 0; i < poly.size(); i++) {
//                double[] ll = poly.get(i);
//                LngLat lngLat = new LngLat(Double.valueOf(ll[0]), Double.valueOf(ll[1]));
//                alphaShapeRet.add(lngLat);
//            }
//        }
//        return alphaShapeRet;
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

