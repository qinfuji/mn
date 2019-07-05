package com.mn.modules.api.entity;

import com.baomidou.mybatisplus.annotation.*;
import com.mn.common.validator.group.AddGroup;
import com.mn.common.validator.group.UpdateGroup;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.ToString;

import javax.validation.constraints.NotNull;

/**
 * 评估任务对象
 */

@TableName("estimate_task_t")
@Data
@ToString()
@ApiModel("点址评估任务对象")
public class EstimateTask extends Base{

    /**
     * 主键
     */
    @TableId(type= IdType.UUID)
    @NotNull(groups = UpdateGroup.class)
    String id;
    /**
     * 标签过滤列表
     */
    @ApiModelProperty("标签过滤列表")
    @TableField("filter_labels")
    String filterLabels ;

    /**
     *  热力围栏列表
     */
    @ApiModelProperty("热力围栏数据")
    @TableField("hot_fences")
    String hotFences;

    /**
     * 围栏热力数据时间
     */
    @ApiModelProperty("围栏热力数据采集时间")
    @TableField("fence_hot_date")
    String fencesHotDate;

    /**
     * 围栏热力条件
     */
    @ApiModelProperty("围栏热力数据采集条件")
    @TableField("fence_hot_condition")
    String fenaceHotCondition;


    /**
     * 点址评估任务的辐射距离
     */
    @ApiModelProperty("辐射距离")
    @TableField("distance")
    @NotNull(groups = {AddGroup.class})
    Double distance;

    /**
     * 测控点数据
     */
    @ApiModelProperty("测控点id")
    @TableField("observe_id")
    @NotNull(groups = {AddGroup.class} )
    String observeId;

    /**
     * 当前数据状态
     */
    @ApiModelProperty("任务状态")
    Integer state;

    /**
     * 任务执行阶段状态， 任务状态分为3个部分，1、通过到访数据计算围栏， 2、通过到访数据计算命中的已有围栏， 3、获取命中围栏人口数据 4、获取用户标记的热力图数据
     * 需要更具状态值计算 ， 已完成状态
     * 获取用户围栏任务  1 （1）
     * 获取人口数量任务  2  (2)
     * 计算围栏         3  (3）
     */
    @ApiModelProperty("任务执行状态")
    @TableField("exec_state")
    Integer execState;

    /**
     * 关联的点址id
     */
    @ApiModelProperty("点址id")
    @TableField("pointer_address_id")
    @NotNull(groups = {AddGroup.class})
    String pointerAddressId;

    @ApiModelProperty("评估结果数据id")
    @TableField("estimate_result_data_id")
    String  resultDataId;

    @Version
    @TableField(value="version", fill = FieldFill.INSERT_UPDATE)
    private Integer version;
}
