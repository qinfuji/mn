package com.mn.modules.api.entity;

import com.baomidou.mybatisplus.annotation.FieldFill;
import com.baomidou.mybatisplus.annotation.TableField;
import com.mn.common.validator.group.AddGroup;

import javax.validation.constraints.NotNull;

public class Base {

    /**
     * 创建用户
     */
    @TableField("created_user_id")
    String createdUserId;

    @TableField("created_user_name")
    String createdUserName;
    /**
     * 创建时间
     */
    @TableField(value = "created_time", fill = FieldFill.INSERT_UPDATE, update="NOW()")
    String createdTime;
    /**
     * 最后修改用户
     */
    @TableField("last_updated_user_id")
    String lastUpdatedUserId;


    @TableField("last_updated_user_name")
    String lastUpdatedUserName;

    /**
     * 最后修改用户名
     */
    @TableField(value = "updated_time", fill = FieldFill.INSERT_UPDATE, update="NOW()")
    String lastUpdsatedUserName;
}
