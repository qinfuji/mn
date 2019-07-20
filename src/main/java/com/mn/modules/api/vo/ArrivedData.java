package com.mn.modules.api.vo;

import com.mn.modules.api.utils.LngLat;
import lombok.Data;

@Data
public class ArrivedData {

    /**
     * 经纬度
     */
    LngLat lngLat;

    /**
     * 到访比例
     */
    Integer arrivedRate;
}
