package com.mn.modules.api.entity;

import com.baomidou.mybatisplus.annotation.TableField;
import lombok.Data;

import javax.validation.constraints.NotNull;

@Data
public class LngLat {

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
}
