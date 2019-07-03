package com.mn.modules.api.remote;

import com.mn.modules.api.vo.ObserverPoint;
import com.mn.modules.api.vo.ObserverPointData;

import java.util.List;

/**
 * 测控点服务
 */
public interface ObservePointService {
    /**
     * 获取测控点列表
     * @return
     */
    List<ObserverPoint> getObserverPointList();


    /**
     * 获取测控点数据
     * @return
     */
    List<ObserverPointData> getObserveData(String observerId);
}
