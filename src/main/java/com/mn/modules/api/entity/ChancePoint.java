package com.mn.modules.api.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.mn.modules.api.vo.EstimateResult;
import lombok.Data;

import java.util.List;

/**
 * 机会点
 */
@TableName("chance_point_t")
@Data
public class ChancePoint extends GeographyPoint {


    @TableId(type= IdType.UUID)
    String id;
    /**
     * 商铺id
     */
    @TableField("shop_id")
    String shopId;

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


    /**
     * 机会点评估结果
     */
    @TableField(exist = false)
    List<EstimateResult> estimateResults;
}