package com.mn.modules.api.remote;

import com.mn.modules.api.entity.GeographyPoint;
import com.mn.modules.api.utils.LngLat;

public interface GaodeMapService {


    /**
     * 通过地址获取详细信息
     * @return
     */
    GeographyPoint getGeographyPointByLnglat(LngLat lnglat);
}
