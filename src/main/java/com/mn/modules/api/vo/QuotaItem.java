package com.mn.modules.api.vo;

import lombok.AllArgsConstructor;
import lombok.Data;

/**
 * 指标项
 */
@Data
@AllArgsConstructor
public class QuotaItem {

    /**
     * item 类型
     */
    String type;

    /**
     * 描述
     */
    String label;

    /**
     * 值
     */
    String value;
}
