package com.mn.modules.api.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

/**
 * 机会点评估数据
 */
@Data
@TableName("estimate_result_data_t")
public class EstimateResultData {

    @TableId(type = IdType.AUTO)
    Long  id;

    /**
     * 机会点id
     */
    @TableField("chance_id")
    String chanceId;

    @TableField
    String data;
}
