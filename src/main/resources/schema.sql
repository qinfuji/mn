CREATE TABLE `pointer_address_t` (
  `id` VARCHAR(32) NOT NULL,
  `user_id` VARCHAR(45) NULL,
  `code` VARCHAR(45) NULL,
  `state` VARCHAR(40) NULL,
  `type` VARCHAR(30) NOT NULL,
  `organization_id` VARCHAR(45) NULL,
  `version` INT NOT NULL DEFAULT 1,
  `name` VARCHAR(45) NOT NULL,
  `address` VARCHAR(200) NOT NULL,
  `lng` DECIMAL(10,6) NOT NULL,
  `lat` DECIMAL(10,6) NOT NULL,
  `fence` TEXT NULL,
  `province` VARCHAR(45) NOT NULL,
  `province_name` VARCHAR(45) NOT NULL,
  `city` VARCHAR(45) NOT NULL,
  `city_name` VARCHAR(45) NOT NULL,
  `district` VARCHAR(45) NOT NULL,
  `district_name` VARCHAR(45) NOT NULL,
  `created_user_id` VARCHAR(45) NULL,
  `created_user_name` VARCHAR(45) NULL,
  `created_time` DATETIME NOT NULL,
  `last_updated_user_id` VARCHAR(45) NULL,
  `last_updated_user_name` VARCHAR(45) NULL,
  `updated_time` DATETIME NOT NULL,
  PRIMARY KEY (`id`));


CREATE TABLE `estimate_task_t` (
  `id` varchar(32) NOT NULL,
  `filter_labels` varchar(200) DEFAULT NULL COMMENT '标签过滤列表',
  `competitor_ids` varchar(200) DEFAULT NULL,
  `arrive_scale` int(11) DEFAULT NULL COMMENT '到访百分比',
  `show_person_count` int(11) DEFAULT NULL,
  `hot_fences` text COMMENT '热力围栏数据',
  `fence_hot_date` date DEFAULT NULL COMMENT '围栏热力数据采集时间',
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

  PRIMARY KEY (`id`))


  CREATE TABLE `estimate_result_t` (
    `id` VARCHAR(32) NOT NULL,
    `fence` TEXT NULL COMMENT '址最终产生的围栏数据',
    `fence_hot_datas` TEXT NULL COMMENT '用户定义的围栏热力数据',
    `observer_rate_flow` VARCHAR(45) NULL COMMENT '测控点流量',
    `radiation_distance` VARCHAR(45) NULL COMMENT '评估辐射距离',
    `radiation_area` VARCHAR(45) NULL COMMENT '评估辐射面积',
    PRIMARY KEY (`id`));


CREATE TABLE `pointer_address_label_t` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `label_id` INT NOT NULL COMMENT '标签id',
  `pointer_address_id` VARCHAR(45) NOT NULL COMMENT '点址id',
  PRIMARY KEY (`id`));


 CREATE TABLE `categroy_label_t` (
   `id` INT NOT NULL AUTO_INCREMENT,
   `parent_id` INT NULL COMMENT '父标签id',
   `state` INT(1) NOT NULL COMMENT '标签状态',
   `label` VARCHAR(45) NOT NULL COMMENT '标签名称',
   PRIMARY KEY (`id`));

