package com.mn.modules.api.utils;

import lombok.Data;

@Data
public class LngLat {
    /**
     * X坐标
     */
    private Double lng;
    /**
     * Y坐标
     */
    private Double lat;
    /**
     * 与P0点的角度
     */
    private double arCos;
}
