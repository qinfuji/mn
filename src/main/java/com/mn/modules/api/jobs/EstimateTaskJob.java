package com.mn.modules.api.jobs;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.mn.modules.api.entity.EstimateTask;
import com.mn.modules.api.service.EstimateTaskService;
import org.quartz.DisallowConcurrentExecution;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Profile;
import org.springframework.scheduling.quartz.QuartzJobBean;
import org.springframework.stereotype.Component;

import java.util.List;

@Profile({"prod","dev","sit"})
@Component
@DisallowConcurrentExecution
public class EstimateTaskJob  extends QuartzJobBean {

    private static Logger logger = LoggerFactory.getLogger(EstimateTaskJob.class);

    @Autowired
    EstimateTaskService estimateTaskService;

    @Override
    protected void executeInternal(JobExecutionContext jobExecutionContext) throws JobExecutionException {
        //首先查询到没有执行完成的任务
        QueryWrapper<EstimateTask> queryWrapper = new QueryWrapper<>();
        queryWrapper.ne("exec_state", EstimateTaskService.EXEC_STATUS_FINISH_CODE);
        queryWrapper.eq("state", EstimateTaskService.STATUS_COMMITED);
        List<EstimateTask> estimateTaskList = estimateTaskService.list(queryWrapper);

        estimateTaskList.forEach((estimateTask)->{
            Integer execState =  estimateTask.getExecState();
            logger.info("执行评估任务： 点址id:{} , 任务id：{} , 当前执行状态 ：{} " ,estimateTask.getPointerAddressId() , estimateTask.getId() , estimateTask.getExecState()  );
            if((execState & EstimateTaskService.EXEC_STATUS_CALCULATED_FENCE) != EstimateTaskService.EXEC_STATUS_CALCULATED_FENCE){
                logger.info("执行评估任务： 点址id:{} , 任务id：{} , 当前执行任务 ：{} " ,estimateTask.getPointerAddressId() , estimateTask.getId() , EstimateTaskService.EXEC_STATUS_CALCULATED_FENCE  );
                estimateTaskService.execCalculateFence(estimateTask);
            }else if((execState & EstimateTaskService.EXEC_STATUS_REQUESTED_FENCE_HOT_DATA) != EstimateTaskService.EXEC_STATUS_REQUESTED_FENCE_HOT_DATA){
                logger.info("执行评估任务： 点址id:{} , 任务id：{} , 当前执行任务 ：{} " ,estimateTask.getPointerAddressId() , estimateTask.getId() , EstimateTaskService.EXEC_STATUS_REQUESTED_FENCE_HOT_DATA  );
                estimateTaskService.execRequestUserFenceHotData(estimateTask);
            }else if((execState & EstimateTaskService.EXEC_STATUS_REQUESTED_FENCE_DATA) != EstimateTaskService.EXEC_STATUS_REQUESTED_FENCE_DATA){
                logger.info("执行评估任务： 点址id:{} , 任务id：{} , 当前执行任务 ：{} " ,estimateTask.getPointerAddressId() , estimateTask.getId() , EstimateTaskService.EXEC_STATUS_REQUESTED_FENCE_DATA  );
                estimateTaskService.execRequestFenceData(estimateTask);
            }
        });

    }
}
