package com.mn.modules.api.vo;

import com.mn.modules.api.entity.EstimateTask;
import com.mn.modules.api.entity.PointerAddress;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PointerAddressAndEstimateTask {

    PointerAddress pointerAddress;

    EstimateTask estimateTask;
}
