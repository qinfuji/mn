-- MySQL dump 10.13  Distrib 5.7.25, for Linux (x86_64)
--
-- Host: localhost    Database: mn_bi_dev
-- ------------------------------------------------------
-- Server version	5.7.25

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Current Database: `mn_bi_dev`
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `mn_bi_dev` /*!40100 DEFAULT CHARACTER SET utf8 */;

USE `mn_bi_dev`;

--
-- Table structure for table `QRTZ_BLOB_TRIGGERS`
--

DROP TABLE IF EXISTS `QRTZ_BLOB_TRIGGERS`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `QRTZ_BLOB_TRIGGERS` (
  `SCHED_NAME` varchar(120) NOT NULL,
  `TRIGGER_NAME` varchar(190) NOT NULL,
  `TRIGGER_GROUP` varchar(190) NOT NULL,
  `BLOB_DATA` blob,
  PRIMARY KEY (`SCHED_NAME`,`TRIGGER_NAME`,`TRIGGER_GROUP`),
  KEY `SCHED_NAME` (`SCHED_NAME`,`TRIGGER_NAME`,`TRIGGER_GROUP`),
  CONSTRAINT `QRTZ_BLOB_TRIGGERS_ibfk_1` FOREIGN KEY (`SCHED_NAME`, `TRIGGER_NAME`, `TRIGGER_GROUP`) REFERENCES `QRTZ_TRIGGERS` (`SCHED_NAME`, `TRIGGER_NAME`, `TRIGGER_GROUP`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `QRTZ_BLOB_TRIGGERS`
--

LOCK TABLES `QRTZ_BLOB_TRIGGERS` WRITE;
/*!40000 ALTER TABLE `QRTZ_BLOB_TRIGGERS` DISABLE KEYS */;
/*!40000 ALTER TABLE `QRTZ_BLOB_TRIGGERS` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `QRTZ_CALENDARS`
--

DROP TABLE IF EXISTS `QRTZ_CALENDARS`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `QRTZ_CALENDARS` (
  `SCHED_NAME` varchar(120) NOT NULL,
  `CALENDAR_NAME` varchar(190) NOT NULL,
  `CALENDAR` blob NOT NULL,
  PRIMARY KEY (`SCHED_NAME`,`CALENDAR_NAME`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `QRTZ_CALENDARS`
--

LOCK TABLES `QRTZ_CALENDARS` WRITE;
/*!40000 ALTER TABLE `QRTZ_CALENDARS` DISABLE KEYS */;
/*!40000 ALTER TABLE `QRTZ_CALENDARS` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `QRTZ_CRON_TRIGGERS`
--

DROP TABLE IF EXISTS `QRTZ_CRON_TRIGGERS`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `QRTZ_CRON_TRIGGERS` (
  `SCHED_NAME` varchar(120) NOT NULL,
  `TRIGGER_NAME` varchar(190) NOT NULL,
  `TRIGGER_GROUP` varchar(190) NOT NULL,
  `CRON_EXPRESSION` varchar(120) NOT NULL,
  `TIME_ZONE_ID` varchar(80) DEFAULT NULL,
  PRIMARY KEY (`SCHED_NAME`,`TRIGGER_NAME`,`TRIGGER_GROUP`),
  CONSTRAINT `QRTZ_CRON_TRIGGERS_ibfk_1` FOREIGN KEY (`SCHED_NAME`, `TRIGGER_NAME`, `TRIGGER_GROUP`) REFERENCES `QRTZ_TRIGGERS` (`SCHED_NAME`, `TRIGGER_NAME`, `TRIGGER_GROUP`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `QRTZ_CRON_TRIGGERS`
--

LOCK TABLES `QRTZ_CRON_TRIGGERS` WRITE;
/*!40000 ALTER TABLE `QRTZ_CRON_TRIGGERS` DISABLE KEYS */;
INSERT INTO `QRTZ_CRON_TRIGGERS` VALUES ('quartzScheduler','estimateTaskCronTrigger','DEFAULT','0 0/1 * * * ?','Asia/Shanghai');
/*!40000 ALTER TABLE `QRTZ_CRON_TRIGGERS` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `QRTZ_FIRED_TRIGGERS`
--

DROP TABLE IF EXISTS `QRTZ_FIRED_TRIGGERS`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `QRTZ_FIRED_TRIGGERS` (
  `SCHED_NAME` varchar(120) NOT NULL,
  `ENTRY_ID` varchar(95) NOT NULL,
  `TRIGGER_NAME` varchar(190) NOT NULL,
  `TRIGGER_GROUP` varchar(190) NOT NULL,
  `INSTANCE_NAME` varchar(190) NOT NULL,
  `FIRED_TIME` bigint(13) NOT NULL,
  `SCHED_TIME` bigint(13) NOT NULL,
  `PRIORITY` int(11) NOT NULL,
  `STATE` varchar(16) NOT NULL,
  `JOB_NAME` varchar(190) DEFAULT NULL,
  `JOB_GROUP` varchar(190) DEFAULT NULL,
  `IS_NONCONCURRENT` varchar(1) DEFAULT NULL,
  `REQUESTS_RECOVERY` varchar(1) DEFAULT NULL,
  PRIMARY KEY (`SCHED_NAME`,`ENTRY_ID`),
  KEY `IDX_QRTZ_FT_TRIG_INST_NAME` (`SCHED_NAME`,`INSTANCE_NAME`),
  KEY `IDX_QRTZ_FT_INST_JOB_REQ_RCVRY` (`SCHED_NAME`,`INSTANCE_NAME`,`REQUESTS_RECOVERY`),
  KEY `IDX_QRTZ_FT_J_G` (`SCHED_NAME`,`JOB_NAME`,`JOB_GROUP`),
  KEY `IDX_QRTZ_FT_JG` (`SCHED_NAME`,`JOB_GROUP`),
  KEY `IDX_QRTZ_FT_T_G` (`SCHED_NAME`,`TRIGGER_NAME`,`TRIGGER_GROUP`),
  KEY `IDX_QRTZ_FT_TG` (`SCHED_NAME`,`TRIGGER_GROUP`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `QRTZ_FIRED_TRIGGERS`
--

LOCK TABLES `QRTZ_FIRED_TRIGGERS` WRITE;
/*!40000 ALTER TABLE `QRTZ_FIRED_TRIGGERS` DISABLE KEYS */;
/*!40000 ALTER TABLE `QRTZ_FIRED_TRIGGERS` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `QRTZ_JOB_DETAILS`
--

DROP TABLE IF EXISTS `QRTZ_JOB_DETAILS`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `QRTZ_JOB_DETAILS` (
  `SCHED_NAME` varchar(120) NOT NULL,
  `JOB_NAME` varchar(190) NOT NULL,
  `JOB_GROUP` varchar(190) NOT NULL,
  `DESCRIPTION` varchar(250) DEFAULT NULL,
  `JOB_CLASS_NAME` varchar(250) NOT NULL,
  `IS_DURABLE` varchar(1) NOT NULL,
  `IS_NONCONCURRENT` varchar(1) NOT NULL,
  `IS_UPDATE_DATA` varchar(1) NOT NULL,
  `REQUESTS_RECOVERY` varchar(1) NOT NULL,
  `JOB_DATA` blob,
  PRIMARY KEY (`SCHED_NAME`,`JOB_NAME`,`JOB_GROUP`),
  KEY `IDX_QRTZ_J_REQ_RECOVERY` (`SCHED_NAME`,`REQUESTS_RECOVERY`),
  KEY `IDX_QRTZ_J_GRP` (`SCHED_NAME`,`JOB_GROUP`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `QRTZ_JOB_DETAILS`
--

LOCK TABLES `QRTZ_JOB_DETAILS` WRITE;
/*!40000 ALTER TABLE `QRTZ_JOB_DETAILS` DISABLE KEYS */;
INSERT INTO `QRTZ_JOB_DETAILS` VALUES ('quartzScheduler','estimateTaskJobDetail','DEFAULT','地址评估任务执行器','com.mn.modules.api.jobs.EstimateTaskJob','1','1','0','1',_binary '�\�\0sr\0org.quartz.JobDataMap���迩�\�\0\0xr\0&org.quartz.utils.StringKeyDirtyFlagMap�\�\��\�](\0Z\0allowsTransientDataxr\0org.quartz.utils.DirtyFlagMap\�.�(v\n\�\0Z\0dirtyL\0mapt\0Ljava/util/Map;xp\0sr\0java.util.HashMap\��\�`\�\0F\0\nloadFactorI\0	thresholdxp?@\0\0\0\0\0w\0\0\0\0\0\0\0x\0');
/*!40000 ALTER TABLE `QRTZ_JOB_DETAILS` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `QRTZ_LOCKS`
--

DROP TABLE IF EXISTS `QRTZ_LOCKS`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `QRTZ_LOCKS` (
  `SCHED_NAME` varchar(120) NOT NULL,
  `LOCK_NAME` varchar(40) NOT NULL,
  PRIMARY KEY (`SCHED_NAME`,`LOCK_NAME`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `QRTZ_LOCKS`
--

LOCK TABLES `QRTZ_LOCKS` WRITE;
/*!40000 ALTER TABLE `QRTZ_LOCKS` DISABLE KEYS */;
INSERT INTO `QRTZ_LOCKS` VALUES ('quartzScheduler','STATE_ACCESS'),('quartzScheduler','TRIGGER_ACCESS');
/*!40000 ALTER TABLE `QRTZ_LOCKS` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `QRTZ_PAUSED_TRIGGER_GRPS`
--

DROP TABLE IF EXISTS `QRTZ_PAUSED_TRIGGER_GRPS`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `QRTZ_PAUSED_TRIGGER_GRPS` (
  `SCHED_NAME` varchar(120) NOT NULL,
  `TRIGGER_GROUP` varchar(190) NOT NULL,
  PRIMARY KEY (`SCHED_NAME`,`TRIGGER_GROUP`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `QRTZ_PAUSED_TRIGGER_GRPS`
--

LOCK TABLES `QRTZ_PAUSED_TRIGGER_GRPS` WRITE;
/*!40000 ALTER TABLE `QRTZ_PAUSED_TRIGGER_GRPS` DISABLE KEYS */;
/*!40000 ALTER TABLE `QRTZ_PAUSED_TRIGGER_GRPS` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `QRTZ_SCHEDULER_STATE`
--

DROP TABLE IF EXISTS `QRTZ_SCHEDULER_STATE`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `QRTZ_SCHEDULER_STATE` (
  `SCHED_NAME` varchar(120) NOT NULL,
  `INSTANCE_NAME` varchar(190) NOT NULL,
  `LAST_CHECKIN_TIME` bigint(13) NOT NULL,
  `CHECKIN_INTERVAL` bigint(13) NOT NULL,
  PRIMARY KEY (`SCHED_NAME`,`INSTANCE_NAME`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `QRTZ_SCHEDULER_STATE`
--

LOCK TABLES `QRTZ_SCHEDULER_STATE` WRITE;
/*!40000 ALTER TABLE `QRTZ_SCHEDULER_STATE` DISABLE KEYS */;
INSERT INTO `QRTZ_SCHEDULER_STATE` VALUES ('quartzScheduler','qinfuji-dev1562945505562',1562951039579,10000);
/*!40000 ALTER TABLE `QRTZ_SCHEDULER_STATE` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `QRTZ_SIMPLE_TRIGGERS`
--

DROP TABLE IF EXISTS `QRTZ_SIMPLE_TRIGGERS`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `QRTZ_SIMPLE_TRIGGERS` (
  `SCHED_NAME` varchar(120) NOT NULL,
  `TRIGGER_NAME` varchar(190) NOT NULL,
  `TRIGGER_GROUP` varchar(190) NOT NULL,
  `REPEAT_COUNT` bigint(7) NOT NULL,
  `REPEAT_INTERVAL` bigint(12) NOT NULL,
  `TIMES_TRIGGERED` bigint(10) NOT NULL,
  PRIMARY KEY (`SCHED_NAME`,`TRIGGER_NAME`,`TRIGGER_GROUP`),
  CONSTRAINT `QRTZ_SIMPLE_TRIGGERS_ibfk_1` FOREIGN KEY (`SCHED_NAME`, `TRIGGER_NAME`, `TRIGGER_GROUP`) REFERENCES `QRTZ_TRIGGERS` (`SCHED_NAME`, `TRIGGER_NAME`, `TRIGGER_GROUP`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `QRTZ_SIMPLE_TRIGGERS`
--

LOCK TABLES `QRTZ_SIMPLE_TRIGGERS` WRITE;
/*!40000 ALTER TABLE `QRTZ_SIMPLE_TRIGGERS` DISABLE KEYS */;
/*!40000 ALTER TABLE `QRTZ_SIMPLE_TRIGGERS` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `QRTZ_SIMPROP_TRIGGERS`
--

DROP TABLE IF EXISTS `QRTZ_SIMPROP_TRIGGERS`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `QRTZ_SIMPROP_TRIGGERS` (
  `SCHED_NAME` varchar(120) NOT NULL,
  `TRIGGER_NAME` varchar(190) NOT NULL,
  `TRIGGER_GROUP` varchar(190) NOT NULL,
  `STR_PROP_1` varchar(512) DEFAULT NULL,
  `STR_PROP_2` varchar(512) DEFAULT NULL,
  `STR_PROP_3` varchar(512) DEFAULT NULL,
  `INT_PROP_1` int(11) DEFAULT NULL,
  `INT_PROP_2` int(11) DEFAULT NULL,
  `LONG_PROP_1` bigint(20) DEFAULT NULL,
  `LONG_PROP_2` bigint(20) DEFAULT NULL,
  `DEC_PROP_1` decimal(13,4) DEFAULT NULL,
  `DEC_PROP_2` decimal(13,4) DEFAULT NULL,
  `BOOL_PROP_1` varchar(1) DEFAULT NULL,
  `BOOL_PROP_2` varchar(1) DEFAULT NULL,
  PRIMARY KEY (`SCHED_NAME`,`TRIGGER_NAME`,`TRIGGER_GROUP`),
  CONSTRAINT `QRTZ_SIMPROP_TRIGGERS_ibfk_1` FOREIGN KEY (`SCHED_NAME`, `TRIGGER_NAME`, `TRIGGER_GROUP`) REFERENCES `QRTZ_TRIGGERS` (`SCHED_NAME`, `TRIGGER_NAME`, `TRIGGER_GROUP`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `QRTZ_SIMPROP_TRIGGERS`
--

LOCK TABLES `QRTZ_SIMPROP_TRIGGERS` WRITE;
/*!40000 ALTER TABLE `QRTZ_SIMPROP_TRIGGERS` DISABLE KEYS */;
/*!40000 ALTER TABLE `QRTZ_SIMPROP_TRIGGERS` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `QRTZ_TRIGGERS`
--

DROP TABLE IF EXISTS `QRTZ_TRIGGERS`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `QRTZ_TRIGGERS` (
  `SCHED_NAME` varchar(120) NOT NULL,
  `TRIGGER_NAME` varchar(190) NOT NULL,
  `TRIGGER_GROUP` varchar(190) NOT NULL,
  `JOB_NAME` varchar(190) NOT NULL,
  `JOB_GROUP` varchar(190) NOT NULL,
  `DESCRIPTION` varchar(250) DEFAULT NULL,
  `NEXT_FIRE_TIME` bigint(13) DEFAULT NULL,
  `PREV_FIRE_TIME` bigint(13) DEFAULT NULL,
  `PRIORITY` int(11) DEFAULT NULL,
  `TRIGGER_STATE` varchar(16) NOT NULL,
  `TRIGGER_TYPE` varchar(8) NOT NULL,
  `START_TIME` bigint(13) NOT NULL,
  `END_TIME` bigint(13) DEFAULT NULL,
  `CALENDAR_NAME` varchar(190) DEFAULT NULL,
  `MISFIRE_INSTR` smallint(2) DEFAULT NULL,
  `JOB_DATA` blob,
  PRIMARY KEY (`SCHED_NAME`,`TRIGGER_NAME`,`TRIGGER_GROUP`),
  KEY `IDX_QRTZ_T_J` (`SCHED_NAME`,`JOB_NAME`,`JOB_GROUP`),
  KEY `IDX_QRTZ_T_JG` (`SCHED_NAME`,`JOB_GROUP`),
  KEY `IDX_QRTZ_T_C` (`SCHED_NAME`,`CALENDAR_NAME`),
  KEY `IDX_QRTZ_T_G` (`SCHED_NAME`,`TRIGGER_GROUP`),
  KEY `IDX_QRTZ_T_STATE` (`SCHED_NAME`,`TRIGGER_STATE`),
  KEY `IDX_QRTZ_T_N_STATE` (`SCHED_NAME`,`TRIGGER_NAME`,`TRIGGER_GROUP`,`TRIGGER_STATE`),
  KEY `IDX_QRTZ_T_N_G_STATE` (`SCHED_NAME`,`TRIGGER_GROUP`,`TRIGGER_STATE`),
  KEY `IDX_QRTZ_T_NEXT_FIRE_TIME` (`SCHED_NAME`,`NEXT_FIRE_TIME`),
  KEY `IDX_QRTZ_T_NFT_ST` (`SCHED_NAME`,`TRIGGER_STATE`,`NEXT_FIRE_TIME`),
  KEY `IDX_QRTZ_T_NFT_MISFIRE` (`SCHED_NAME`,`MISFIRE_INSTR`,`NEXT_FIRE_TIME`),
  KEY `IDX_QRTZ_T_NFT_ST_MISFIRE` (`SCHED_NAME`,`MISFIRE_INSTR`,`NEXT_FIRE_TIME`,`TRIGGER_STATE`),
  KEY `IDX_QRTZ_T_NFT_ST_MISFIRE_GRP` (`SCHED_NAME`,`MISFIRE_INSTR`,`NEXT_FIRE_TIME`,`TRIGGER_GROUP`,`TRIGGER_STATE`),
  CONSTRAINT `QRTZ_TRIGGERS_ibfk_1` FOREIGN KEY (`SCHED_NAME`, `JOB_NAME`, `JOB_GROUP`) REFERENCES `QRTZ_JOB_DETAILS` (`SCHED_NAME`, `JOB_NAME`, `JOB_GROUP`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `QRTZ_TRIGGERS`
--

LOCK TABLES `QRTZ_TRIGGERS` WRITE;
/*!40000 ALTER TABLE `QRTZ_TRIGGERS` DISABLE KEYS */;
INSERT INTO `QRTZ_TRIGGERS` VALUES ('quartzScheduler','estimateTaskCronTrigger','DEFAULT','estimateTaskJobDetail','DEFAULT',NULL,1562951100000,1562951040000,0,'WAITING','CRON',1562945504000,0,NULL,2,'');
/*!40000 ALTER TABLE `QRTZ_TRIGGERS` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categroy_label_t`
--

DROP TABLE IF EXISTS `categroy_label_t`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `categroy_label_t` (
  `id` varchar(32) NOT NULL,
  `parent_id` int(11) DEFAULT NULL COMMENT '父标签id',
  `state` int(1) NOT NULL COMMENT '标签状态',
  `label` varchar(45) NOT NULL COMMENT '标签名称',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categroy_label_t`
--

LOCK TABLES `categroy_label_t` WRITE;
/*!40000 ALTER TABLE `categroy_label_t` DISABLE KEYS */;
INSERT INTO `categroy_label_t` VALUES ('8f5b44331315749c61c21c4fbd3a33b2',NULL,1,'测试二'),('9126666bc2150491082e28fa2731c74e',NULL,1,'测试一');
/*!40000 ALTER TABLE `categroy_label_t` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `estimate_data_result_t`
--

DROP TABLE IF EXISTS `estimate_data_result_t`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `estimate_data_result_t` (
  `id` varchar(32) NOT NULL,
  `fence` text COMMENT '址最终产生的围栏数据',
  `fence_hot_datas` text COMMENT '用户定义的围栏热力数据',
  `observer_rate_flow` varchar(45) DEFAULT NULL COMMENT '测控点流量',
  `radiation_distance` varchar(45) DEFAULT NULL COMMENT '评估辐射距离',
  `radiation_area` varchar(45) DEFAULT NULL COMMENT '评估辐射面积',
  `arrive_persion_data` text,
  `conclusion` varchar(45) DEFAULT NULL,
  `enter_date` varchar(20) DEFAULT NULL,
  `business_type` varchar(45) DEFAULT NULL,
  `state` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `estimate_data_result_t`
--

LOCK TABLES `estimate_data_result_t` WRITE;
/*!40000 ALTER TABLE `estimate_data_result_t` DISABLE KEYS */;
INSERT INTO `estimate_data_result_t` VALUES ('86910112279f5d2ea9c60b1b53f411ef','116.520352,40.017883;116.519794,40.0214;116.521253,40.023668;116.525202,40.023996;116.54181,40.024128;116.550481,40.021576;116.551425,40.019012;116.545415,40.007332;116.541252,40.007102;116.525975,40.008548;116.5234,40.010751',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),('c023662c134dbf22cfa4e2154ed0997e','116.523228,40.01223;116.531039,40.012394;116.539752,40.011288;116.546016,40.009962;116.545415,40.007332;116.541252,40.007102;116.525975,40.008548;116.5234,40.010751',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),('f503763231e83f9ed6988527275f798f','116.544943,40.022583;116.546016,40.009962;116.545415,40.007332;116.541252,40.007102;116.525975,40.008548;116.513745,40.016744;116.513488,40.019834;116.521253,40.023668;116.525202,40.023996;116.54181,40.024128',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `estimate_data_result_t` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `estimate_result_t`
--

DROP TABLE IF EXISTS `estimate_result_t`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `estimate_result_t` (
  `id` varchar(32) NOT NULL,
  `fence` text COMMENT '址最终产生的围栏数据',
  `fence_hot_datas` text COMMENT '用户定义的围栏热力数据',
  `observer_rate_flow` varchar(45) DEFAULT NULL COMMENT '测控点流量',
  `radiation_distance` varchar(45) DEFAULT NULL COMMENT '评估辐射距离',
  `radiation_area` varchar(45) DEFAULT NULL COMMENT '评估辐射面积',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `estimate_result_t`
--

LOCK TABLES `estimate_result_t` WRITE;
/*!40000 ALTER TABLE `estimate_result_t` DISABLE KEYS */;
/*!40000 ALTER TABLE `estimate_result_t` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `estimate_task_t`
--

DROP TABLE IF EXISTS `estimate_task_t`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `estimate_task_t` (
  `id` varchar(32) NOT NULL,
  `filter_labels` varchar(200) DEFAULT NULL COMMENT '标签过滤列表',
  `hot_fences` text COMMENT '热力围栏数据',
  `fence_hot_date` varchar(200) DEFAULT NULL COMMENT '围栏热力数据采集时间',
  `fence_hot_condition` varchar(45) DEFAULT NULL COMMENT '围栏热力数据采集条件',
  `distance` int(11) DEFAULT NULL COMMENT '辐射距离,单位米',
  `observe_id` varchar(45) DEFAULT NULL COMMENT '测控点id',
  `state` varchar(10) DEFAULT NULL COMMENT '任务状态',
  `exec_state` int(11) DEFAULT NULL COMMENT '任务执行状态 ',
  `pointer_address_id` varchar(45) NOT NULL COMMENT '点址id',
  `estimate_result_data_id` varchar(45) NOT NULL COMMENT '数据表id',
  `version` varchar(45) NOT NULL,
  `created_user_id` varchar(45) DEFAULT NULL,
  `created_user_name` varchar(45) DEFAULT NULL,
  `created_time` datetime NOT NULL,
  `last_updated_user_id` varchar(45) DEFAULT NULL,
  `last_updated_user_name` varchar(45) DEFAULT NULL,
  `updated_time` datetime NOT NULL,
  `competitor_ids` varchar(200) DEFAULT NULL,
  `arrive_scale` int(11) DEFAULT NULL,
  `show_person_count` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `estimate_task_t`
--

LOCK TABLES `estimate_task_t` WRITE;
/*!40000 ALTER TABLE `estimate_task_t` DISABLE KEYS */;
INSERT INTO `estimate_task_t` VALUES ('0544c0ac053c3e349fe69fb1aba3c5f2','8f5b44331315749c61c21c4fbd3a33b2','116.532199,40.004714;116.533487,40.002544;116.53928,40.004155','2019-07-28;2019-07-28','1',1000,'1221212','1',7,'9ee951031e7f4bed085ee81a39552879','c023662c134dbf22cfa4e2154ed0997e','6',NULL,NULL,'2019-07-13 00:43:56',NULL,NULL,'2019-07-13 00:46:00','',20,0),('3cd5f63e430e1a5aa687db6a911d7ee9','8f5b44331315749c61c21c4fbd3a33b2','116.545246,40.015364;116.546233,40.012636;116.550653,40.013491;116.549065,40.01612','2019-07-13;2019-07-20','1',1500,'1221212','1',7,'b7ec4b39287c0bba5d4e067ec9911b5d','86910112279f5d2ea9c60b1b53f411ef','6',NULL,NULL,'2019-07-13 00:36:13',NULL,NULL,'2019-07-13 00:39:00','8f239e64ba04c8c9c7068fe48344f802',20,0);
/*!40000 ALTER TABLE `estimate_task_t` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pointer_address_label_t`
--

DROP TABLE IF EXISTS `pointer_address_label_t`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `pointer_address_label_t` (
  `id` varchar(32) NOT NULL,
  `label_id` varchar(32) NOT NULL COMMENT '标签id',
  `pointer_address_id` varchar(45) NOT NULL COMMENT '点址id',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pointer_address_label_t`
--

LOCK TABLES `pointer_address_label_t` WRITE;
/*!40000 ALTER TABLE `pointer_address_label_t` DISABLE KEYS */;
INSERT INTO `pointer_address_label_t` VALUES ('2635ca733f74684f5af6d6b0013cec74','9126666bc2150491082e28fa2731c74e','5d02e0745a0dbd2576dd11554eceba91'),('4c638b576cccb0b7fdc0d2adf2284045','8f5b44331315749c61c21c4fbd3a33b2','9ee951031e7f4bed085ee81a39552879'),('4fdeb4aa3d796dab001b32225a2fb6d7','8f5b44331315749c61c21c4fbd3a33b2','8f239e64ba04c8c9c7068fe48344f802'),('5bb9869ee1caf6684c85178d68199636','9126666bc2150491082e28fa2731c74e','b7ec4b39287c0bba5d4e067ec9911b5d'),('65346256e408823eeee2546ba29785e1','8f5b44331315749c61c21c4fbd3a33b2','a6c3e1852d560f2859127442f06b1a13'),('746e1aa1e15a338be360454bf7b6df95','9126666bc2150491082e28fa2731c74e','a6c3e1852d560f2859127442f06b1a13'),('7e048bb438dd0b35ff8a534749ef6406','8f5b44331315749c61c21c4fbd3a33b2','020c7024ac6a069db7e88dde33533103'),('953292f1f26c6ccd72b038d440e9ea5d','9126666bc2150491082e28fa2731c74e','850fa694f47aeed61af87ed087e727c4'),('9a6ab541c6836b326004d86d3b8ab2ac','8f5b44331315749c61c21c4fbd3a33b2','293305a495bd017c9a60ccab17a5f34c'),('ba5aedd53fbd84c622607c07a5b742b6','8f5b44331315749c61c21c4fbd3a33b2','5d02e0745a0dbd2576dd11554eceba91'),('c809a7e721f33e6b4bbc6b00b1ca3ea5','9126666bc2150491082e28fa2731c74e','8f239e64ba04c8c9c7068fe48344f802'),('c9af2d5ed38072f13c800bbe73ce5967','9126666bc2150491082e28fa2731c74e','293305a495bd017c9a60ccab17a5f34c'),('cf9a26b238b96f2a282f65e7f1c1cd86','9126666bc2150491082e28fa2731c74e','6d630994997d35215e6c953fa7d098e3'),('e1150930ce703b1dc9f770549038b6bd','9126666bc2150491082e28fa2731c74e','020c7024ac6a069db7e88dde33533103'),('e26881de0c89631bb870a40732b252c4','8f5b44331315749c61c21c4fbd3a33b2','6d630994997d35215e6c953fa7d098e3'),('ff9b018a00c4a40a98278712e4cd17cf','8f5b44331315749c61c21c4fbd3a33b2','850fa694f47aeed61af87ed087e727c4');
/*!40000 ALTER TABLE `pointer_address_label_t` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pointer_address_t`
--

DROP TABLE IF EXISTS `pointer_address_t`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `pointer_address_t` (
  `id` varchar(32) NOT NULL,
  `user_id` varchar(45) DEFAULT NULL,
  `code` varchar(45) DEFAULT NULL,
  `state` varchar(40) DEFAULT NULL,
  `type` varchar(20) NOT NULL,
  `organization_id` varchar(45) DEFAULT NULL,
  `version` int(11) NOT NULL DEFAULT '1',
  `name` varchar(45) NOT NULL,
  `address` varchar(200) NOT NULL,
  `lng` decimal(10,6) NOT NULL,
  `lat` decimal(10,6) NOT NULL,
  `fence` text,
  `province` varchar(45) NOT NULL,
  `province_name` varchar(45) NOT NULL,
  `city` varchar(45) NOT NULL,
  `city_name` varchar(45) NOT NULL,
  `district` varchar(45) NOT NULL,
  `district_name` varchar(45) NOT NULL,
  `created_user_id` varchar(45) DEFAULT NULL,
  `created_user_name` varchar(45) DEFAULT NULL,
  `created_time` datetime NOT NULL,
  `last_updated_user_id` varchar(45) DEFAULT NULL,
  `last_updated_user_name` varchar(45) DEFAULT NULL,
  `updated_time` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pointer_address_t`
--

LOCK TABLES `pointer_address_t` WRITE;
/*!40000 ALTER TABLE `pointer_address_t` DISABLE KEYS */;
INSERT INTO `pointer_address_t` VALUES ('8f239e64ba04c8c9c7068fe48344f802','xxxxxxx',NULL,'notEstimate','competitionShop','organizationId',0,'蟹岛度假村','北京市朝阳区金盏镇蟹岛农庄广场蟹岛度假村',116.548099,40.019390,'116.545846,40.02059;116.546919,40.018092;116.551425,40.019012;116.550481,40.021576','110000','北京市','110100','北京市市辖区','110105','朝阳区',NULL,NULL,'2019-07-13 00:27:33',NULL,NULL,'2019-07-13 00:27:33'),('9ee951031e7f4bed085ee81a39552879','xxxxxxx',NULL,'estimateFinished','chance','organizationId',4,'京旺家园四区','北京市朝阳区崔各庄镇京旺家园(四区)京旺家园四区',116.531534,40.010877,'116.529281,40.012307;116.529839,40.009776;116.535032,40.009809;116.534946,40.012274','110000','北京市','110100','北京市市辖区','110105','朝阳区',NULL,NULL,'2019-07-13 00:43:15',NULL,NULL,'2019-07-13 00:46:00'),('b7ec4b39287c0bba5d4e067ec9911b5d','xxxxxxx',NULL,'estimateFinished','chance','organizationId',6,'北京国际航空俱乐部','北京市朝阳区崔各庄镇北京国际航空俱乐部',116.534710,40.015249,'116.532714,40.016777;116.532972,40.013326;116.537392,40.013984;116.537435,40.016416','110000','北京市','110100','北京市市辖区','110105','朝阳区',NULL,NULL,'2019-07-12 23:33:13',NULL,NULL,'2019-07-13 00:39:00');
/*!40000 ALTER TABLE `pointer_address_t` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `share_pointer_address_t`
--

DROP TABLE IF EXISTS `share_pointer_address_t`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `share_pointer_address_t` (
  `id` varchar(32) NOT NULL,
  `name` varchar(45) NOT NULL,
  `address` varchar(200) NOT NULL,
  `lng` decimal(10,6) NOT NULL,
  `lat` decimal(10,6) NOT NULL,
  `fence` text,
  `province` varchar(45) NOT NULL,
  `province_name` varchar(45) NOT NULL,
  `city` varchar(45) NOT NULL,
  `city_name` varchar(45) NOT NULL,
  `district` varchar(45) NOT NULL,
  `district_name` varchar(45) NOT NULL,
  `created_user_id` varchar(45) DEFAULT NULL,
  `created_user_name` varchar(45) DEFAULT NULL,
  `created_time` datetime NOT NULL,
  `last_updated_user_id` varchar(45) DEFAULT NULL,
  `last_updated_user_name` varchar(45) DEFAULT NULL,
  `updated_time` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `share_pointer_address_t`
--

LOCK TABLES `share_pointer_address_t` WRITE;
/*!40000 ALTER TABLE `share_pointer_address_t` DISABLE KEYS */;
INSERT INTO `share_pointer_address_t` VALUES ('020c7024ac6a069db7e88dde33533103','测试点址','北京市朝阳区崔各庄镇首都机场辅路',116.533873,40.020130,'116.531598,40.022266;116.531384,40.018027;116.53619,40.018881;116.536319,40.019407','100000','100000','100000','100000','110105','100000',NULL,NULL,'2019-07-12 23:29:41',NULL,NULL,'2019-07-12 23:29:41'),('293305a495bd017c9a60ccab17a5f34c','测试点址','北京市朝阳区金盏镇长店大街',116.542926,40.008762,'116.541252,40.009896;116.541252,40.007102;116.545415,40.007332;116.546016,40.009962','100000','100000','100000','100000','110105','100000',NULL,NULL,'2019-07-12 23:29:41',NULL,NULL,'2019-07-12 23:29:41'),('5d02e0745a0dbd2576dd11554eceba91','测试点址','北京市朝阳区崔各庄镇朝林科技园',116.539364,40.020069,'116.536961,40.022353;116.537347,40.017916;116.544471,40.017883;116.544943,40.022583;116.54181,40.024128;116.541209,40.021959','100000','100000','100000','100000','110105','100000',NULL,NULL,'2019-07-12 23:29:41',NULL,NULL,'2019-07-12 23:29:41'),('6d630994997d35215e6c953fa7d098e3','测试点址','北京市朝阳区金盏镇长店大街62',116.536319,40.009661,'116.534087,40.011222;116.535933,40.008231;116.538443,40.008149;116.539752,40.011288','100000','100000','100000','100000','110105','100000',NULL,NULL,'2019-07-12 23:29:41',NULL,NULL,'2019-07-12 23:29:41'),('850fa694f47aeed61af87ed087e727c4','测试点址','北京市朝阳区崔各庄镇太利花园',116.523013,40.019806,'116.519794,40.0214;116.520352,40.017883;116.526146,40.018343;116.525717,40.021269;116.525202,40.023996;116.521253,40.023668;116.523571,40.021466','100000','100000','100000','100000','110105','100000',NULL,NULL,'2019-07-12 23:29:41',NULL,NULL,'2019-07-12 23:29:41'),('a6c3e1852d560f2859127442f06b1a13','测试点址','北京市朝阳区崔各庄镇京旺家园(三区)京旺家园三区',116.527777,40.010274,'116.5234,40.010751;116.525932,40.010701;116.525975,40.008548;116.530996,40.008581;116.531039,40.012394;116.523228,40.01223','100000','100000','100000','100000','110105','100000',NULL,NULL,'2019-07-12 23:29:41',NULL,NULL,'2019-07-12 23:29:41');
/*!40000 ALTER TABLE `share_pointer_address_t` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2019-07-12 17:04:02
