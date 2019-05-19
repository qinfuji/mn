package com.mn.modules.api.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.mn.common.validator.group.UpdateGroup;
import com.mn.modules.api.vo.EstimateResult;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.ToString;

import javax.validation.constraints.NotNull;
import java.util.List;

/**
 * 机会点
 */
@TableName("chance_point_t")
@Data
@ToString()
@ApiModel
public class ChancePoint extends GeographyPoint {


    @TableId(type= IdType.UUID)
    @NotNull(groups = UpdateGroup.class)
    String id;
    /**
     * 商铺id
     */
    @TableField("shop_id")
    @ApiModelProperty("商铺ID")
    String shopId;

    /**
     * 数据所有者
     */
    @TableField("appId")
    @ApiModelProperty("接入用户appid")
    @NotNull
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