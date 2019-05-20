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


    /**
     * 初始化省市
     * @param userAccount
     */
    void init(String userAccount);
    /**
     * 获取账户的所有省
     * @param account
     * @return
     */
     Map<String , String> getProvince(String account);

    /**
     * 获取所有城市
     * @param userAccount
     * @param  provinceKeys 省份列表
     * @return 返回账户与省为key的城市列表
     */
    Map<String, Map<String,String>> getCitys(String userAccount , List<String> provinceKeys);


    /**
     *
     * 获取省市下的机会点（商铺）列表
     * @param userAccount
     * @param province 省中文名称
     * @param city  城市中文名称
     * @return
     */
     List<ChancePoint> getChancePointList(String userAccount , String province , String city );


    /**
     * 查询机会点相对应的商铺id
     * @param userAccount
     * @param chancePoint
     * @return
     */
    String getChancePointShopId(String userAccount, ChancePoint chancePoint);
}
