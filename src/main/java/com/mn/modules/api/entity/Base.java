package com.mn.modules.api.entity;

import com.baomidou.mybatisplus.annotation.TableField;

public class Base {


    /**
     * 创建用户
     */
    @TableField(exist = false)
    String createdUserId;

    @TableField(exist = false)
    String createdUserName;
    /**
     * 创建时间
     */
    @TableField("created_time")
    String createdTime;
    /**
     * 最后修改用户
     */
    @TableField(exist = false)
    String lastUpdatedUserId;

    /**
     * 最后修改用户名
     */
    @TableField("updated_time")
    String lastUpdsatedUserName;
}
