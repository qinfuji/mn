package com.mn.common.utils;

/**
 * 常量
 * 
 * @author duxb
 * @email duxb@mippoint.com
 * @date 2016年11月15日 下午1:23:52
 */
public class Constant {
	/** 超级管理员ID */
	public static final int SUPER_ADMIN = 1;

	/**
	 * 菜单类型
	 * 
	 * @author duxb
	 * @email duxb@mippoint.com
	 * @date 2016年11月15日 下午1:24:29
	 */
    public enum MenuType {
        /**
         * 目录
         */
    	CATALOG(0),
        /**
         * 菜单
         */
        MENU(1),
        /**
         * 按钮
         */
        BUTTON(2);

        private int value;

        MenuType(int value) {
            this.value = value;
        }

        public int getValue() {
            return value;
        }
    }
    
    /**
     * 定时任务状态
     * 
     * @author duxb
     * @email duxb@mippoint.com
     * @date 2016年12月3日 上午12:07:22
     */
    public enum ScheduleStatus {
        /**
         * 正常
         */
    	NORMAL(0),
        /**
         * 暂停
         */
    	PAUSE(1);

        private int value;

        ScheduleStatus(int value) {
            this.value = value;
        }
        
        public int getValue() {
            return value;
        }
    }

    /**
     * 云服务商
     */
    public enum CloudService {
        /**
         * 七牛云
         */
        QINIU(1),
        /**
         * 阿里云
         */
        ALIYUN(2),
        /**
         * 腾讯云
         */
        QCLOUD(3);

        private int value;

        CloudService(int value) {
            this.value = value;
        }

        public int getValue() {
            return value;
        }
    }

    //声牙画像api
    //获取App列表
    public static final String sy_applist="third/v1/potr/getapplist";
    //获取用户画像
    public static final String sy_forbox="third/v1/potr/forbox";
    //获取客群经纬度信息
    public static final String sy_getloc="third/v1/potr/getloc";
    //获取实时客流人数
    public static final String sy_getFlowNum="third/v1/potr/getFlowNum";
    //获取当天客流人数
    public static final String sy_todayFlow="third/v1/potr/todayFlow";
    //画像店铺类型
    public static final String sy_findStoreType="third/v1/potr/findStoreType";
    //创建店铺
    public static final String sy_addPortStore="/third/v1/potr/manage/addPortStore";
    //查询店铺列表
    public static final String sy_findStoreList="third/v1/potr/findStoreList";
    //上传数据
    public static final String sy_uploaddate="third/v1/potr/upload_date";

}
