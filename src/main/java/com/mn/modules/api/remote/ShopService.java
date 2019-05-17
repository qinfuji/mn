package com.mn.modules.api.remote;

import com.mn.modules.api.entity.ChancePoint;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;

/**
 * 查询门店
 */
@Component
public interface ShopService {


    void init(String userAccount);
    /**
     * 获取账户的所有省
     * @param account
     * @return
     */
     Map<String , String> getProvince(String account);

    /**
     * 获取所有城市
     * @param  provinceKeys 省份列表
     * @return
     */
    Map<String , String> getCitys(String userAccount , List<String> provinceKeys);


    /**
     *
     * 获取省市下的机会点（商铺）列表
     * @param userAccount
     * @return
     */
     List<ChancePoint> getChancePointList(String userAccount , String province , String city );
}
