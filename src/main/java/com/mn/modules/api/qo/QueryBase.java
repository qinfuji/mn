package com.mn.modules.api.qo;

import lombok.Data;

@Data
public class QueryBase {

    private int pageSize = 50;
    private int pageIndex = 1;

    private String orderby;
}
