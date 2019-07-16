package com.mn.modules.api.vo;

import com.mn.modules.api.utils.LngLat;
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
     List<LngLat> arrivedPoints;
}
