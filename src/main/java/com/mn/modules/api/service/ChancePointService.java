package com.mn.modules.api.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.mn.modules.api.entity.AnalysisResult;
import com.mn.modules.api.entity.ChancePoint;
import com.mn.modules.api.vo.EstimateResult;

import java.util.Date;
import java.util.List;

/**
 * 机会点
 */
public interface ChancePointService {

    String AREA_SCOPE_CUNTRY ="cuntry";
    String AREA_SCOPE_PROVINCE = "province";
    String AREA_SCOPE_CITY = "city";
    String AREA_SCOPE_DISTRICT = "district";

    /**
     * 无效状态
     */
    String CHANCE_STATUS_INVALID = "-1";


    /**
     * 创建机会点
     * @param chancePoint 机会点对象
     * @return 创建后的机会点
     */
    ChancePoint createChancePoint(ChancePoint chancePoint);

    /**
     * 查询机会点
     * @param id 机会点id
     * @return
     */
    ChancePoint queryChance(String id);
    /**
     * 更新机会点
     * @param chancePoint
     * @return 更新后的机会点
     */
    ChancePoint updateChancePoint(ChancePoint chancePoint);


    /**
     * 使机会点无效
     * @param id
     * @return
     */
    boolean invalidChancePoint(String id);

    /**
     * 按行政区域查询用户的机会点
     * @param scope   范围  province | city | district
     * @param adCode  行政区域编码
     * @param appId
     * @return 机会点分页列表
     */
    IPage<ChancePoint> getChancePointList(String scope , String adCode , String appId , IPage pageParam , String userAccount);


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
    List<AnalysisResult> analysisHistory(ChancePoint chancePoint);
}
