package com.mn.modules.api.vo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * 指标项
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class QuotaItem<T> {

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
    T value;

}
