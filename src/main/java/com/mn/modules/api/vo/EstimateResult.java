package com.mn.modules.api.vo;


import lombok.Data;

import java.util.ArrayList;
import java.util.List;

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
    List<Quota> quotas = new ArrayList<>();


    public void add(Quota quota){
         quotas.add(quota);
    }
}
