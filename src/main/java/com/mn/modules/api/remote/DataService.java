package com.mn.modules.api.remote;

import org.springframework.stereotype.Component;

import java.util.List;

/**
 * 外部评估结果查询
 */
@Component
public interface DataService {

    /**
     * 获取围栏的热力数据
     *
     * @param fancse
     * @return
     */
    List getFanceHotData(List fancse);

    /**
     * 获取围栏的评估数据
     *
     * @param fances
     * @return
     */
    List getFanceEstimateData(List fances);
}
