CREATE TABLE `chance_point_t` (
  `id` VARCHAR(36) NOT NULL,
  `shop_id` VARCHAR(30) NULL,
  `appId` VARCHAR(30) NULL,
  `status` VARCHAR(10) NULL,
  `name` VARCHAR(45) NOT NULL,
  `address` VARCHAR(45) NOT NULL,
  `type` VARCHAR(20) NOT NULL,
  `lng` DECIMAL(10,6) NOT NULL,
  `lat` DECIMAL(10,6) NOT NULL,
  `fence_data` TEXT NULL,
  `province` VARCHAR(20) NULL,
  `province_name` VARCHAR(20) NULL,
  `city` VARCHAR(20) NULL,
  `city_name` VARCHAR(20) NULL,
  `district` VARCHAR(20) NULL,
  `district_name` VARCHAR(20) NULL,
  `created_time` DATETIME NULL,
  `updated_time` DATETIME NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC));
