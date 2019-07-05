package com.mn.modules.api.qo;

import lombok.Data;

@Data
public class QueryBase {

    private Integer pageSize = 50;
    private Integer pageIndex = 1;

    private String orderby;
}
