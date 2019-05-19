package com.mn.modules.api.vo;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

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
     * 备注
     */
    String remark;

    /**
     * 指标权重
     */
    double weight;

    /**
     * 指标项
     */
    List<QuotaItem> values = new ArrayList<>();


    public void add(QuotaItem quotaItem){
        values.add(quotaItem);
    }
}
