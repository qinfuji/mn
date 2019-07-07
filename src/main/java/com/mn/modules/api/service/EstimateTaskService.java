package com.mn.modules.api.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.mn.modules.api.entity.EstimateDataResult;
import com.mn.modules.api.entity.EstimateTask;

public interface EstimateTaskService extends IService<EstimateTask> {

     /**
      * 为提交
      */
     int STATUS_WAIT_COMMIT = 0;
     /**
      * 已经提交
      */
     int STATUS_COMMITED = 1;

     /**
      * 任务失效
      */
     int STATUS_INVALID = 2;

     /**
      * 空的执行状态
      */
     int EXEC_STATUS_NULL = 0;

     /**
      * 计算围栏
      */
     int EXEC_STATUS_CALCULATED_FENCE =1;

     /**
      * 请求围栏的统计数据
      */
     int EXEC_STATUS_REQUESTED_FENCE_DATA=2;

     /**
      * 请求用户定义的围栏的热力数据
      */
     int EXEC_STATUS_REQUESTED_FENCE_HOT_DATA=3;
     /**
      * 任务执行玩的状态
      */
     int EXEC_STATUS_FINISH_CODE =  EXEC_STATUS_CALCULATED_FENCE|EXEC_STATUS_REQUESTED_FENCE_DATA|EXEC_STATUS_REQUESTED_FENCE_HOT_DATA;


     /**
      * 创建任务对象，并同时创建任务结果对象
      * @return
      */
     EstimateTask createEstimate(EstimateTask estimateTask);

     /**
      * 获取有限的地址评估任务
      * @param pointerAddressId
      * @return
      */
     EstimateTask getEstimateTaskWithPointerAddressId(String pointerAddressId);


     /**
      * 得到当前任务的结果
      * @param estimateTaskId
      * @return
      */
     EstimateDataResult getEstimateDataResult(String estimateTaskId);
     /**
      * 删除当前任务
      * @param task
      */
     void invalid(EstimateTask task);

     /**
      * 执行计算围栏
      * @param task
      */
     void execCalculateFence(EstimateTask task);

     /**
      * 执行请求命中围栏的评估数据
      * @param task
      */
     void execRequestFenceData(EstimateTask task);


     /**
      * 请求用户定义围栏的热力数据
      * @param task
      */
     void execRequestUserFenceHotData(EstimateTask task);
}
