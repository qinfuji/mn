package com.mn.modules.api.entity;

import com.baomidou.mybatisplus.annotation.*;
import com.mn.common.validator.group.AddGroup;
import com.mn.common.validator.group.UpdateGroup;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.ToString;

import javax.validation.constraints.NotNull;

@TableName("pointer_t")
@Data
@ToString()
@ApiModel
public class PointerAddress extends GeographyPoint{




    @TableId(type= IdType.UUID)
    @NotNull(groups = UpdateGroup.class)
    String id;

    /**
     * 数据所有者
     */
    @TableField("appId")
    @ApiModelProperty("接入用户appid")
    @NotNull(groups = {AddGroup.class} )
    String userId;


    @ApiModelProperty("code")
    @TableField("code")
    String code;

    /**
     * 状态
     */
    @ApiModelProperty("点址状态")
    @TableField(value = "state" , fill = FieldFill.INSERT, update="save")
    String state;


    /**
     * 点址类型
     */
    @TableField("type")
    @ApiModelProperty("点址类型")
    @NotNull(groups = {AddGroup.class} )
    String type;


    /**
     * 数据所有组织机构id
     */
    @TableField("organization_id")
    @ApiModelProperty("组织机构id")
    @NotNull(groups = {AddGroup.class} )
    String organizationId;


    @Version
    private Integer version;
}
