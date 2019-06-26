package com.mn.modules.api.utils;

import lombok.Data;

@Data
public class Point {
    /**
     * X坐标
     */
    private float x;
    /**
     * Y坐标
     */
    private float y;
    /**
     * 与P0点的角度
     */
    private double arCos;
}
