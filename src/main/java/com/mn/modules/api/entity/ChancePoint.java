package com.mn.modules.api.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

/**
 * 机会点
 */
@TableName("chance_point_t")
@Data
public class ChancePoint extends GeographyPoint {


    @TableId(type= IdType.UUID)
    String id;
    /**
     * 机会点ID （商铺id）
     */
    @TableField("chance_id")
    String chanceId;

    /**
     * 数据所有者
     */
    @TableField("appId")
    String appId;

    /**
     * 状态
     */
    @TableField("status")
    String status;


}