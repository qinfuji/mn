package com.mn.modules.api.entity;


import com.baomidou.mybatisplus.annotation.FieldFill;
import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.mn.common.validator.group.UpdateGroup;
import io.swagger.annotations.ApiModelProperty;

import javax.validation.constraints.NotNull;

/**
 * 分类标签
 */
public class CategroyLabel {

    /**
     * 标签Id
     */
    @TableId(type= IdType.UUID)
    @NotNull(groups = UpdateGroup.class)
    String id;

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
    String label;
}
