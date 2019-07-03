package com.mn.modules.api.service;

import com.mn.modules.api.entity.EstimateTask;

public interface EstimateTaskService {

     int FINISH_CODE = 15;

     void execTask();


     /**
      * 创建评估任务
      * @param task
      * @param userId
      * @return
      */
     EstimateTask create(EstimateTask task , String userId);

     /**
      * 修改评估任务
      * @param id
      * @param task
      * @param userId
      * @return
      */
     EstimateTask update(Integer id ,  EstimateTask task , String userId);

     /**
      * 删除
      * @param id 任务主键
      * @param userId
      * @return
      */
     EstimateTask delete(Integer id , String userId);


     /**
      * 执行计算围栏
      * @param task
      */
     void execCalculateFance(EstimateTask task);

     /**
      * 执行请求命中围栏的评估数据
      * @param task
      */
     void execRequestFanceData(EstimateTask task);


     /**
      * 请求用户定义围栏的热力数据
      * @param task
      */
     void execRequestUserFanceHotData(EstimateTask task);
}
