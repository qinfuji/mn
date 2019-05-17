package com.mn.modules.api.remote;

import com.mn.modules.api.entity.ChancePoint;
import com.mn.modules.api.vo.Quota;
import org.springframework.stereotype.Component;

import java.util.Date;

/**
 * 外部评估结果查询
 */
@Component
public interface ChancePointEstimateService {

    /**
     * 商圈人口体量.
     * POST /business_circle_population
     * 用户可商圈内获取人口总量、固定人口、流动人口
     *
     * @param userAccount 账户信息
     * @param chancePoint 机会点
     * @param date  时间
     * @return
     */
     Quota getBusinessCirclePopulation(String userAccount , ChancePoint chancePoint , Date date);


    /**
     * 商圈活跃度
     * POST /business_circle_active
     * 用户可获取商圈内商业主体、商务楼、社区数量.
     *
     * @param userAccount 账户信息
     * @param chancePoint 机会点
     * @param date    时间
     * @return
     */
    Quota getBusinessCircleActive(String userAccount , ChancePoint chancePoint , Date date);

    /**
     * 商圈活跃度Top榜
     * POST /get_business_circle_active_top
     * 用户可获取商圈内商业主体、商务楼、社区距离top榜.
     *
     * @param userAccount 账户信息
     * @param chancePoint 机会点
     * @param date    时间
     * @return
     */
    Quota getBusinessCircleActiveTop(String userAccount , ChancePoint chancePoint , Date date);


    /**
     * 商区人口体量
     * POST /business_district_population
     * 用户可获取商区内人口总量、固定人口、流动人口
     *
     * @param userAccount 账户信息
     * @param chancePoint 机会点
     * @param date    时间
     * @return
     */
    Quota getBusinessDistrictPopulation(String userAccount , ChancePoint chancePoint , Date date);


    /**
     * 商区消费者活跃度
     * POST /business_district_customer_active
     * 用户可获取商区内年龄段占比
     *
     * @param userAccount 账户信息
     * @param chancePoint 机会点
     * @param date    时间
     * @return
     */
    Quota getBusinessDistrictCustomerActive(String userAccount , ChancePoint chancePoint , Date date);

    /**
     * 商区消费者有子女占比
     * POST /business_district_customer_children_proportion
     * 用户可获取商区内有无子女占比
     *
     * @param userAccount 账户信息
     * @param chancePoint 机会点
     * @param date    时间
     * @return
     */
      Quota getBusinessDistrictCustomerChildrenProportion(String userAccount , ChancePoint chancePoint , Date date);


    /**
     * 商区活跃度
     * POST /business_district_active
     * 用户可获取商区内商业主体、商务楼、社区数量
     *
     * @param userAccount 账户信息
     * @param chancePoint 机会点
     * @param date    时间
     * @return
     */
    Quota getBusinessDistrictActive(String userAccount , ChancePoint chancePoint , Date date);

    /**
     * 商区关键配套
     * POST /business_district_mating
     * 用户可获取商区内银行、房产中介、超市、便利店、高校、医院数量
     *
     * @param userAccount 账户信息
     * @param chancePoint 机会点
     * @param date    时间
     * @return
     */
    Quota getBusinessDistrictMating(String userAccount , ChancePoint chancePoint , Date date);

    /**
     * 商区公交路线数量、公交站点数
     * POST /business_district_bus_num
     * 用户可获取商区内公交路线数量、公交站点数
     *
     * @param userAccount 账户信息
     * @param chancePoint 机会点
     * @param date    时间
     * @return
     */
    Quota getBusinessDistrictBusNum(String userAccount , ChancePoint chancePoint , Date date);

    /**
     * 商区活跃度Top榜
     * POST /get_business_district_active_top
     * 用户可获取商区内商业主体、商务楼、社区距离top榜
     *
     * @param userAccount 账户信息
     * @param chancePoint 机会点
     * @param date    时间
     * @return
     */
    Quota getBusinessDistrictActiveTop(String userAccount , ChancePoint chancePoint , Date date);

    /**
     * 商区关键配套Top榜
     * POST /get_business_district_mating_top
     * 用户可获取商区内银行、房产中介、超市、便利店、高校、医院top榜
     *
     * @param userAccount 账户信息
     * @param chancePoint 机会点
     * @param date    时间
     * @return
     */
    Quota getBusinessDistrictMatingTop(String userAccount , ChancePoint chancePoint , Date date);

    /**
     * 商区交路线数量、公交站点Top榜
     * POST /get_business_district_bus_top
     * 用户可获取商区内公交路线数量、公交站点距离 top榜
     *
     * @param userAccount 账户信息
     * @param chancePoint 机会点
     * @param date    时间
     * @return
     */
    Quota getBusinessDistrictBusTop(String userAccount , ChancePoint chancePoint , Date date);


    /**
     *  街道关键配套
     *  POST /street_mating
     *  用户可获取主要街道内银行、房产中介、超市、便利店、高校、医院数量
     *
     * @param userAccount 账户信息
     * @param chancePoint 机会点
     * @param date    时间
     * @return
     */
    Quota getStreetMating(String userAccount , ChancePoint chancePoint , Date date);

    /**
     * 街道关键配套Top榜
     * POST /get_street_top
     * 用户可获取要街道内银行、房产中介、超市、便利店、高校、医院距离top榜
     *
     * @param userAccount 账户信息
     * @param chancePoint 机会点
     * @param date    时间
     * @return
     *
     */
    Quota getStreetTop(String userAccount , ChancePoint chancePoint , Date date);
}
