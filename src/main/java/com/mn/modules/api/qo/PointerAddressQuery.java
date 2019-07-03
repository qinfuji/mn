package com.mn.modules.api.qo;

import lombok.Data;

@Data
public class PointerAddressQuery extends QueryBase{

    private String address;
    private String scope;
    private String adcode;
    private String state;
    private String labels;

}
