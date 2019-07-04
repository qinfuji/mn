package com.mn.modules.api.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.mn.common.validator.group.AddGroup;
import com.mn.common.validator.group.UpdateGroup;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.ToString;

import javax.validation.constraints.NotNull;

@TableName("pointer_address_label_t")
@Data
@ToString()
@ApiModel("点址的标签表")
public class PointerAddressLabel {


    @TableId(type= IdType.AUTO)
    @NotNull(groups = UpdateGroup.class)
    Integer id;
    /**
     * 标签名称
     */
    @TableField("label_id")
    @ApiModelProperty("标签名称id")
    @NotNull(groups = {AddGroup.class}, message = "标签名称id必须填写")
    Integer labelId;

    /**
     * 点址id
     */
    @TableField("pointer_address_id")
    @NotNull(groups = {AddGroup.class} , message = "点址id必须填写")
    String pointerAddressId;
}
