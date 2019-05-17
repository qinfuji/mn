package com.mn.modules.api.entity;


import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;

import java.math.BigDecimal;
import java.io.Serializable;
import java.util.Date;

/**
 * 
 * 
 * @author duxb
 * @email duxb@mippoint.com
 * @date 2019-04-09 13:25:28
 */
@TableName("sy_rawdata")
public class SyRawdataEntity implements Serializable {
	private static final long serialVersionUID = 1L;

	/**
	 * 编号
	 */
	@TableId
	private Long id;
	/**
	 * 盒子芯片码
	 */
	private String chipno;
	/**
	 * 当前盒子采集数据所关联的场景
	 */
	private String mac;
	/**
	 * 采集设备mac码
	 */
	private String scene;
	/**
	 * 目标mac离盒子大概距离
	 */
	private BigDecimal dist;
	/**
	 * 当前记录采集时间戳
	 */
	private Long t;
	/**
	 * 热点名称
	 */
	private String bssidname;
	/**
	 * 对应的路由id
	 */
	private String relateid;
	/**
	 * 经度
	 */
	private BigDecimal lon;
	/**
	 * 维度
	 */
	private BigDecimal lat;
	/**
	 * mac采集的信号强度
	 */
	private String rssi;
	/**
	 * 该mac的设备厂商信息
	 */
	private String manu;
	/**
	 * 标识该mac是否为手机设备，1：是；0：不是
	 */
	private Integer ismobile;
	/**
	 * 0表示rssi由路由发出，1表示手机发出
	 */
	private Integer isRssibid;
	/**
	 * 入库时间
	 */
	private Date createtime;

	/**
	 * 设置：编号
	 */
	public void setId(Long id) {
		this.id = id;
	}
	/**
	 * 获取：编号
	 */
	public Long getId() {
		return id;
	}
	/**
	 * 设置：盒子芯片码
	 */
	public void setChipno(String chipno) {
		this.chipno = chipno;
	}
	/**
	 * 获取：盒子芯片码
	 */
	public String getChipno() {
		return chipno;
	}
	/**
	 * 设置：当前盒子采集数据所关联的场景
	 */
	public void setMac(String mac) {
		this.mac = mac;
	}
	/**
	 * 获取：当前盒子采集数据所关联的场景
	 */
	public String getMac() {
		return mac;
	}
	/**
	 * 设置：采集设备mac码
	 */
	public void setScene(String scene) {
		this.scene = scene;
	}
	/**
	 * 获取：采集设备mac码
	 */
	public String getScene() {
		return scene;
	}
	/**
	 * 设置：目标mac离盒子大概距离
	 */
	public void setDist(BigDecimal dist) {
		this.dist = dist;
	}
	/**
	 * 获取：目标mac离盒子大概距离
	 */
	public BigDecimal getDist() {
		return dist;
	}
	/**
	 * 设置：当前记录采集时间戳
	 */
	public void setT(Long t) {
		this.t = t;
	}
	/**
	 * 获取：当前记录采集时间戳
	 */
	public Long getT() {
		return t;
	}
	/**
	 * 设置：热点名称
	 */
	public void setBssidname(String bssidname) {
		this.bssidname = bssidname;
	}
	/**
	 * 获取：热点名称
	 */
	public String getBssidname() {
		return bssidname;
	}
	/**
	 * 设置：对应的路由id
	 */
	public void setRelateid(String relateid) {
		this.relateid = relateid;
	}
	/**
	 * 获取：对应的路由id
	 */
	public String getRelateid() {
		return relateid;
	}
	/**
	 * 设置：经度
	 */
	public void setLon(BigDecimal lon) {
		this.lon = lon;
	}
	/**
	 * 获取：经度
	 */
	public BigDecimal getLon() {
		return lon;
	}
	/**
	 * 设置：维度
	 */
	public void setLat(BigDecimal lat) {
		this.lat = lat;
	}
	/**
	 * 获取：维度
	 */
	public BigDecimal getLat() {
		return lat;
	}
	/**
	 * 设置：mac采集的信号强度
	 */
	public void setRssi(String rssi) {
		this.rssi = rssi;
	}
	/**
	 * 获取：mac采集的信号强度
	 */
	public String getRssi() {
		return rssi;
	}
	/**
	 * 设置：该mac的设备厂商信息
	 */
	public void setManu(String manu) {
		this.manu = manu;
	}
	/**
	 * 获取：该mac的设备厂商信息
	 */
	public String getManu() {
		return manu;
	}
	/**
	 * 设置：标识该mac是否为手机设备，1：是；0：不是
	 */
	public void setIsmobile(Integer ismobile) {
		this.ismobile = ismobile;
	}
	/**
	 * 获取：标识该mac是否为手机设备，1：是；0：不是
	 */
	public Integer getIsmobile() {
		return ismobile;
	}
	/**
	 * 设置：0表示rssi由路由发出，1表示手机发出
	 */
	public void setIsRssibid(Integer isRssibid) {
		this.isRssibid = isRssibid;
	}
	/**
	 * 获取：0表示rssi由路由发出，1表示手机发出
	 */
	public Integer getIsRssibid() {
		return isRssibid;
	}
	/**
	 * 设置：入库时间
	 */
	public void setCreatetime(Date createtime) {
		this.createtime = createtime;
	}
	/**
	 * 获取：入库时间
	 */
	public Date getCreatetime() {
		return createtime;
	}
}
