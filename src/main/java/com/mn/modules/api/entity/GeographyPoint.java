package com.mn.modules.api.entity;


import com.baomidou.mybatisplus.annotation.TableField;
import lombok.Data;
import lombok.ToString;

import javax.validation.constraints.NotNull;

@Data
@ToString(includeFieldNames = true)
public class GeographyPoint extends Base {
    /**
     * 名称
     */
    @TableField("name")
    @NotNull(message = "名称不能为空")
    String name;
    /**
     * 物理地址
     */
    @TableField("address")
    @NotNull(message = "地址不能为空")
    String address;
    /**
     * 商业类型， 例如学校，写字楼
     */
    @TableField("type")
    @NotNull(message = "类型必须选择")
    String type;
    /**
     * shape中心经度
     */
    @TableField("lng")
    @NotNull(message = "经度不能为空")
    Double lng;
    /**
     * shape中心纬度
     */
    @TableField("lat")
    @NotNull(message = "纬度不能为空")
    Double lat;

    /**
     * 围栏数据
     */
    @TableField("fence_data")
    String fence; //围栏
    /**
     * 省份
     */
    @TableField("province")
    @NotNull(message = "省份编码不能为空")
    String province;//省
    /**
     * 省中文名
     */
    @TableField("province_name")
    @NotNull(message = "省份名称不能为空")
    String provinceName;
    /**
     * 城市
     */
    @TableField("city")
    @NotNull(message = "城市编码不能为空")
    String city;
    /**
     * 城市名称
     */
    @TableField("city_name")
    @NotNull(message = "城市名称不能为空")
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