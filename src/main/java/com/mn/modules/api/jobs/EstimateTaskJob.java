package com.mn.modules.api.jobs;

import com.mn.modules.api.service.EstimateTaskService;
import org.quartz.DisallowConcurrentExecution;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Profile;
import org.springframework.scheduling.quartz.QuartzJobBean;
import org.springframework.stereotype.Component;

@Profile({"prod","dev","sit"})
@Component
@DisallowConcurrentExecution
public class EstimateTaskJob  extends QuartzJobBean {

    @Autowired
    EstimateTaskService estimateTaskService;

    @Override
    protected void executeInternal(JobExecutionContext jobExecutionContext) throws JobExecutionException {
        estimateTaskService.execTask();
    }
}
