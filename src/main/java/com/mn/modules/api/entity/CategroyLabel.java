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
 * 分类标签
 */
@TableName("categroy_label_t")
@Data
@ToString()
@ApiModel("点址评估结果对象")
public class CategroyLabel {

    /**
     * 标签Id
     */
    @TableId(type= IdType.AUTO)
    @NotNull(groups = UpdateGroup.class)
    Integer id;

    /**
     * 父id
     */
    @ApiModelProperty("标签父id")
    @TableField(value = "parent_id")
    String parentId;

    /**
     * 标签名称
     */
    @ApiModelProperty("标签名称")
    @TableField(value = "label")
    @NotNull(groups = AddGroup.class , message = "标签名称必须填写")
    String label;

    /**
     * 标签状态
     */
    @ApiModelProperty("标签状态")
    @TableField(value = "label")
    @NotNull(groups = AddGroup.class , message = "标签名称必须填写")
    Integer state;
}
