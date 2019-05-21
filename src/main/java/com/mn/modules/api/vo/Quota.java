package com.mn.modules.api.vo;

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

    /**
     * 规则处理名称
     */
    String roleName;

    /**
     * 指标顺序
     */
    int order;

    public void add(QuotaItem quotaItem){
        values.add(quotaItem);
    }
}
