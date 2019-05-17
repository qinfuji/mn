package com.mn.modules.api.service;

import com.mn.modules.api.entity.ChancePoint;
import com.mn.modules.api.vo.EstimateResult;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

/**
 * 机会点
 */
public interface ChancePointService {

    /**
     * 创建机会点
     * @param chancePoint 机会点对象
     * @return 创建后的机会点
     */
    ChancePoint createChancePoint(ChancePoint chancePoint);


    /**
     * 更新机会点
     * @param chancePoint
     * @return 更新后的机会点
     */
    ChancePoint updateChancePoint(ChancePoint chancePoint);

    /**
     * 按行政区域查询用户的机会点
     * @param scope   范围  province | city | district
     * @param adCode  行政区域编码
     * @param appId
     * @return 机会点列表
     */
    List<ChancePoint> getChancePoint(String scope , String adCode , String appId);


    /**
     * 通过经纬度范围查询机会点
     * @param lng  经度
     * @param lat  纬度
     * @param radius 查询半径
     * @param appId
     * @return 机会点列表
     */
    List<ChancePoint> getChancePointByLnglat(BigDecimal lng , BigDecimal lat , int radius , String appId);

    /**
     * 返回机会点评估报告
     * @param chancePoint
     * @param userAccount 外部账户
     * @param data 时间
     * @return 评估结果列表
     */
    List<EstimateResult> getChanceEstimateResult(ChancePoint chancePoint , String userAccount , Date data);

    /**
     * 分析机会点评估结果， 用户指标加权重后数据
     * @param chancePoint 机会点s
     * @param estimateResultList 机会点评估结果，用户加入指标权重
     */
    void analysis(ChancePoint chancePoint , List<EstimateResult> estimateResultList);

    /**
     * 评估结果分析劣势
     * @param chancePoint
     * @return
     */
    List<?> analysisHistory(ChancePoint chancePoint);
}
