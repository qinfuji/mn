package com.mn.modules.api.remote;

import com.mn.modules.api.vo.ArrivedData;
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
    List<ObserverPoint> getObserverPointList(String token);


    /**
     * 获取测控点到访数据
     * @return
     */
    List<ArrivedData> getObserveArrivedData(String observerId , String token);


    /**
     * 获取测控点客流数据
     * @param observerId
     * @param token
     * @return
     */
    Integer getObserveFlow(String observerId , String token);

}
