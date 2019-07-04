package com.mn.modules.api.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.mn.modules.api.entity.PointerAddress;
import com.mn.modules.api.qo.PointerAddressQuery;
import com.mn.modules.api.vo.UserInfo;

public interface PointerAddressService {


    String AREA_SCOPE_CUNTRY ="cuntry";
    String AREA_SCOPE_PROVINCE = "province";
    String AREA_SCOPE_CITY = "city";
    String AREA_SCOPE_DISTRICT = "district";


    /**
     * 点址
     */
    String TYPPE_CHANCE = "chance";
    /**
     * 已有店
     */
    String TYPPE_EXIST_SHOP = "existShop";
    /**
     * 竞品店
     */
    String TYPPE_COMPETITION_SHOP = "competitionShop";

    /**
     * 信息待提交
     */
    String STATUS_WAIT_SUBMIT = "waitSubmit";
    /**
     * 待评估
     */
    String STATUS_WAIT_ESTIMATE = "waitEstimate";

    /**
     * 未评估
     */
    String STATUS_NOT_ESTIMATE = "notEstimate";

    /**
     * 已评估
     */
    String STATUS_ESTIMATE_FINISH = "estimateFinished";

    /**
     * 已完成
     */
    String STATUS_ALL_FINISH = "allFinished";

    /**
     * 已删除
     */
    String STATUS_DELETE = "deleted";

    /**
     * 创建点址
     * @param pointerAddress 点址对象
     * @return 创建后的点址
     */
    PointerAddress createPointerAddress(PointerAddress pointerAddress);

    /**
     * 查询点址
     * @param id 点址id
     * @return
     */
    PointerAddress queryPointerAddress(String id);
    /**
     * 更新点址
     * @param pointerAddress
     * @return 更新后的点址
     */
    PointerAddress updatePointerAddress(PointerAddress pointerAddress);


    /**
     * 使点址无效
     * @param pointerAddress
     * @return
     */
    boolean invalidPointerAddress(PointerAddress pointerAddress);

    /**
     * 按行政区域查询用户的点址
     * @param qo
     * @param userInfo
     * @return 点址分页列表
     */
    IPage<PointerAddress> getPointerAddressList(PointerAddressQuery qo , UserInfo userInfo);
}
