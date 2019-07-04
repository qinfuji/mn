package com.mn.modules.api.service;

import com.mn.modules.api.entity.EstimateTask;
import com.mn.modules.api.vo.UserInfo;

public interface EstimateTaskService {

     int FINISH_CODE = 15;

     void execTask();


     /**
      * 创建评估任务
      * @param task
      * @return
      */
     EstimateTask create(EstimateTask task);

     /**
      * 修改评估任务
      * @param id
      * @param task
      * @return
      */
     EstimateTask update(Integer id ,  EstimateTask task);

     /**
      * 删除
      * @param id 任务主键
      * @return
      */
     int delete(Integer id);


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
