package com.mn.modules.api.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.util.Date;

@Data
@TableName("analysis_result_t")
public class AnalysisResult {

    @TableId(type= IdType.AUTO)
    Long id;

    @TableField("chance_id")
    String chanceId;

    /**
     * 分析的标题
     */
    @TableField
    String title;
    /**
     * 分析的目标数据
     */
    @TableField("target_data")
    String targetData;

    /**
     * 分析结果
     */
    @TableField
    String result;

    /**
     * 分析时间
     */
    @TableField("created_time")
    Date  createTime;
}
