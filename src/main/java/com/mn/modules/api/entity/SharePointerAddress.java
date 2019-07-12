package com.mn.modules.api.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.mn.common.validator.group.UpdateGroup;
import io.swagger.annotations.ApiModel;
import lombok.Data;
import lombok.ToString;

import javax.validation.constraints.NotNull;

@TableName("share_pointer_address_t")
@Data
@ToString(callSuper = true)
@ApiModel
public class SharePointerAddress extends GeographyPoint{
    @TableId(type= IdType.UUID)
    @NotNull(groups = UpdateGroup.class , message = "ID不能为空")
    String id;
}
