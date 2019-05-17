package com.mn.modules.api.vo;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
public class Quota {

    /**
     * 指标类型
     */
    String type;

    /**
     * 指标描述
     */
    String label;

    /**
     * 指标权重
     */
    double weight;

    /**
     * 指标项
     */
    QuotaItem[] quotaItems;
}
