package com.mn.modules.api.entity;

import com.baomidou.mybatisplus.annotation.FieldFill;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableName;
import com.baomidou.mybatisplus.annotation.Version;
import com.mn.common.validator.group.AddGroup;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.ToString;

import javax.validation.constraints.NotNull;

@TableName("pointer_address_t")
@Data
@ToString(callSuper = true)
@ApiModel
public class PointerAddress extends SharePointerAddress{

    /**
     * 数据所有者
     */
    @TableField("user_id")
    @ApiModelProperty("接入用户userId")
    String userId;


    @ApiModelProperty("code")
    @TableField("code")
    String code;

    /**
     * 状态
     */
    @ApiModelProperty("点址状态")
    @TableField(value = "state")
    String state;


    /**
     * 点址类型
     */
    @TableField("type")
    @ApiModelProperty("点址类型")
    @NotNull(groups = {AddGroup.class} ,message = "点址类型不能为空" )
    String type;


    /**
     * 数据所有组织机构id
     */
    @TableField("organization_id")
    @ApiModelProperty("组织机构id")
    @NotNull(groups = {AddGroup.class} , message = "组织机构ID名称不能为空")
    String organizationId;


    @Version
    @TableField(value = "version" , fill = FieldFill.INSERT_UPDATE)
    private Integer version;

}
