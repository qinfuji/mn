package com.mn.modules.api.myBatisPlusHandler;

import com.baomidou.mybatisplus.core.handlers.MetaObjectHandler;
import org.apache.ibatis.reflection.MetaObject;
import org.springframework.stereotype.Component;

import java.util.Date;

@Component
public class PointerAddressHandler implements MetaObjectHandler {
    @Override
    public void insertFill(MetaObject metaObject) {
        setFieldValByName("createdTime", new Date() , metaObject);
        setFieldValByName("lastUpdatedTime", new Date(), metaObject);
        Object version = getFieldValByName("version", metaObject);
        if(null == version){
            this.setFieldValByName("version", 0, metaObject);
        }

    }

    @Override
    public void updateFill(MetaObject metaObject) {
        setFieldValByName("lastUpdatedTime", new Date(), metaObject);
        Integer version =  (Integer) getFieldValByName("version", metaObject);
        if(version!=null){
            this.setFieldValByName("version", version+1, metaObject);
        }
    }
}
