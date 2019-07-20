package com.mn.modules.api.vo;

import lombok.Data;

import java.util.List;

@Data
public class ObserverPointData {

     /**
      * 客流总总量
      */
     Integer flowCount;

     /**
      * 到访点数据
      */
     List<ArrivedData> arrivedPoints;
}
