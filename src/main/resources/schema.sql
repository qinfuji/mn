CREATE TABLE `chance_point_t` (
  `id` varchar(36) NOT NULL,
  `shop_id` varchar(30) DEFAULT NULL,
  `appId` varchar(30) DEFAULT NULL,
  `status` varchar(10) DEFAULT '1',
  `name` varchar(45) NOT NULL,
  `address` varchar(45) NOT NULL,
  `type` varchar(20) DEFAULT NULL,
  `lng` decimal(10,6) NOT NULL,
  `lat` decimal(10,6) NOT NULL,
  `fence_data` text,
  `province` varchar(20) DEFAULT NULL,
  `province_name` varchar(20) DEFAULT NULL,
  `city` varchar(20) DEFAULT NULL,
  `city_name` varchar(20) DEFAULT NULL,
  `district` varchar(20) DEFAULT NULL,
  `district_name` varchar(20) DEFAULT NULL,
  `created_time` datetime DEFAULT NULL,
  `updated_time` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


CREATE TABLE `analysis_result_t` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `chance_id` varchar(36) NOT NULL,
  `title` varchar(45) DEFAULT NULL,
  `result` json NOT NULL,
  `created_time` datetime DEFAULT NULL,
  `updated_time` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
