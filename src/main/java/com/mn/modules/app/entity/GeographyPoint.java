package com.mn.modules.app.entity;


import lombok.Data;

@Data
public class GeographyPoint {
    /**
     * 名称
     */
    String   name;
    /**
     * 物理地址
     */
    String address;
    /**
     * 商业类型， 例如学校，写字楼
     */
    String  type;
    /**
     * shape中心经度
     */
    Double longitude;
    /**
     * shape中心纬度
     */
    Double latitude;

    /**
     * 形状类型 圆形 椭圆形 多边形 线
     */
    String shapeType;

    /**
     * 形状数据，不同形状的数据结构不一样
     */
    String JsonData;
}