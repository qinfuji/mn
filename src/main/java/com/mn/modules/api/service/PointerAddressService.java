package com.mn.modules.api.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.mn.modules.api.entity.PointerAddress;
import com.mn.modules.api.qo.PointerAddressQuery;

public interface PointerAddressService {


    String AREA_SCOPE_CUNTRY ="cuntry";
    String AREA_SCOPE_PROVINCE = "province";
    String AREA_SCOPE_CITY = "city";
    String AREA_SCOPE_DISTRICT = "district";

    /**
     * 无效状态
     */
    String POINTER_ADDRESS_STATUS_INVALID = "-1";

    /**
     * 机会点
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
    String STATUS_ESTIMATE_FINISH = "estimateFinish";

    /**
     * 已完成
     */
    String STATUS_ALL_FINISH = "allFinish";

    /**
     * 创建机会点
     * @param pointerAddress 机会点对象
     * @return 创建后的机会点
     */
    PointerAddress createPointerAddress(PointerAddress pointerAddress);

    /**
     * 查询机会点
     * @param id 机会点id
     * @return
     */
    PointerAddress queryPointerAddress(String id);
    /**
     * 更新机会点
     * @param pointerAddress
     * @return 更新后的机会点
     */
    PointerAddress updatePointerAddress(PointerAddress pointerAddress);


    /**
     * 使机会点无效
     * @param id
     * @return
     */
    boolean invalidPointerAddress(String id);

    /**
     * 按行政区域查询用户的机会点
     * @param qo
     * @param userId   用户Id
     * @return 机会点分页列表
     */
    IPage<PointerAddress> getPointerAddressList(PointerAddressQuery qo , String userId);
}
