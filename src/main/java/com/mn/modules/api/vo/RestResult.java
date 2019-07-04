package com.mn.modules.api.vo;

import lombok.Data;

@Data
public class RestResult<T> {

    private int code = 0;
    private T data;
    private String msg = "";

    public static RestResult ok = new RestResult();
    public static RestResult fail = new RestResult().code(500);


    public static RestResult build() {
        return new RestResult();
    }

    public static <T> RestResult build(T data){
        return new RestResult().data(data);
    }

    public RestResult code(int code){
        this.code = code;
        return this;
    }

    public RestResult msg(String msg){
        this.msg = msg;
        return this;
    }

    public RestResult data(T data){
        this.data = data;
        return this;
    }

}
