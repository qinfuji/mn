package com.mn.modules.api.vo;


import lombok.Data;

@Data
public class EstimateResult {
     //评估点
     String type;

    /**
     * 名称
     */
    String label;


    /**
     * 评估指标项
     */
    Quota[] quotas;


}
