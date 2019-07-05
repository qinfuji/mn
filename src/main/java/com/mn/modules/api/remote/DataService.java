package com.mn.modules.api.remote;

import org.springframework.stereotype.Component;

import java.util.List;

/**
 * 外部评估结果查询
 */

public interface DataService {

    /**
     * 获取围栏的热力数据
     *
     * @param fences
     * @return
     */
    List getFenceHotData(List fences);

    /**
     * 获取围栏的评估数据
     *
     * @param fences
     * @return
     */
    List getFenceEstimateData(List fences);
}
