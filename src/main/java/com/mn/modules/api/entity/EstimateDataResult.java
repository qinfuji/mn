package com.mn.modules.api.entity;


import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.mn.common.validator.group.UpdateGroup;
import com.mn.modules.api.validator.SaveConclusion;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.ToString;

import javax.validation.constraints.NotNull;
import java.util.Date;

@TableName("estimate_data_result_t")
@Data
@ToString()
@ApiModel("点址评估任务结果对象")
public class EstimateDataResult {


    @TableId(type= IdType.UUID)
    @NotNull(groups = UpdateGroup.class)
    String id;

    /**
     * 点址最终产生的围栏数据
     */
    @TableField("fence")
    String fence;

    /**
     * 用户定义的围栏热力数据
     */
    @TableField("fence_hot_datas")
    String  fnacehotDatas;


    /**
     * 测控点流量数据
     */
    @ApiModelProperty("测控点流量")
    @TableField("observer_rate_flow")
    Integer  observerRateFlow;


    /**
     * 辐射距离
     */
    @ApiModelProperty("评估辐射距离")
    @TableField("radiation_distance")
    String radiationDistance;

    /**
     * 辐射面积
     */
    @ApiModelProperty("评估辐射面积")
    @TableField("radiation_area")
    String radiationArea;


    @ApiModelProperty("到访人员数量")
    @TableField("arrive_persion_data")
    String arrivePersionData;


    @ApiModelProperty("点址结论")
    @TableField("conclusion")
    @NotNull(groups = SaveConclusion.class , message="点址结论必须填写")
    String conclusion;

    @ApiModelProperty("准入时间")
    @TableField("enter_date")
    @NotNull(groups = SaveConclusion.class , message="准入时间必须填写")
    String enterDate;

    @ApiModelProperty("商圈类型")
    @TableField("business_type")
    @NotNull(groups = SaveConclusion.class , message="商圈类型必须填写")
    String businessType;

    @ApiModelProperty("数据状态")
    @TableField("state")
    String state;
}
