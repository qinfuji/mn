package com.mn.modules.api.entity;


import com.baomidou.mybatisplus.annotation.TableField;
import lombok.Data;
import lombok.ToString;

import java.math.BigDecimal;

@Data
@ToString(includeFieldNames=true)
public class GeographyPoint extends Base{
    /**
     * 名称
     */
    @TableField("name")
    String   name;
    /**
     * 物理地址
     */
    @TableField("address")
    String address;
    /**
     * 商业类型， 例如学校，写字楼
     */
    @TableField("type")
    String  type;
    /**
     * shape中心经度
     */
    @TableField("lng")
    Double lng;
    /**
     * shape中心纬度
     */
    @TableField("lat")
    Double lat;

    /**
     * 围栏数据
     */
    @TableField("fence_data" )
    String fence; //围栏
    /**
     * 省份
     */
    @TableField("province")
    String province;//省
    /**
     * 省中文名
     */
    @TableField("province_name")
    String provinceName;
    /**
     * 城市
     */
    @TableField("city")
    String city;
    /**
     * 城市名称
     */
    @TableField("city_name")
    String cityName;
    /**
     * 地区
     */
    @TableField("district")
    String district;
    /**
     * 地区名称
     */
    @TableField("district_name")
    String districtName;


}