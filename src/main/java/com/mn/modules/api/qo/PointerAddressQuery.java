package com.mn.modules.api.qo;

import lombok.Data;
import lombok.ToString;

@Data
@ToString
public class PointerAddressQuery extends QueryBase{

    /**
     * 查询地址
     */
    private String address;
    /**
     * 查询的中心点位置 经度
     */
    private String lng;
    /**
     * 中心点位置， 维度
     */
    private String lat;
    /**
     * 查询的辐射范围
     */
    private Integer distance;
    /**
     * 查询的范围
     */
    private String scope;
    /**
     * 区域编码
     */
    private String adcode;
    /**
     * 状态
     */
    private String state;
    /**
     * 业态标签
     */
    private String labels;

    /**
     * 点址类型
     */
    private String type;

}
