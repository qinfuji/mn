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

@TableName("pointer_label_t")
@Data
@ToString()
@ApiModel("点址的标签表")
public class PointerLabels extends LngLat{


    @TableId(type= IdType.AUTO)
    @NotNull(groups = UpdateGroup.class)
    Integer id;
    /**
     * 标签名称
     */
    @TableField("label")
    @ApiModelProperty("标签名称")
    @NotNull(groups = {AddGroup.class})
    String label;

    /**
     * 点址id
     */
    @TableField("pointer_address_id")
    @NotNull(groups = {AddGroup.class})
    String pointerAddressId;
}
