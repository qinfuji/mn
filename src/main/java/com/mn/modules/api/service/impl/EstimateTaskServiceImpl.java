package com.mn.modules.api.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.mn.modules.api.dao.EstimateTaskDao;
import com.mn.modules.api.entity.EstimateTask;
import com.mn.modules.api.entity.PointerAddress;
import com.mn.modules.api.service.EstimateTaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class EstimateTaskServiceImpl implements EstimateTaskService {

    @Autowired
    private EstimateTaskDao estimateTaskDao;


    @Override
    public void execTask() {
        //首先查询到没有执行完成的任务
        QueryWrapper<EstimateTask> queryWrapper = new QueryWrapper<>();
        queryWrapper.ne("exec_state" , FINISH_CODE);
        List<EstimateTask>  estimateTaskList = estimateTaskDao.selectList(queryWrapper);



    }

    @Override
    public EstimateTask create(EstimateTask task) {
        estimateTaskDao.insert(task);
        return task;
    }

    @Override
    public EstimateTask update(Integer id, EstimateTask task) {
         estimateTaskDao.updateById(task);
         return task;
    }

    @Override
    public int delete(Integer id) {
        return estimateTaskDao.deleteById(id);
    }

    @Override
    public void execCalculateFance(EstimateTask task) {

    }

    @Override
    public void execRequestFanceData(EstimateTask task) {

    }

    @Override
    public void execRequestUserFanceHotData(EstimateTask task) {

    }
}
