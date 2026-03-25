-- --------------------------------------------------------
-- Pure PHP Admin Panel SQL Dump
-- Compatible with phpMyAdmin / MySQL 5.7+ / MariaDB 10+
-- --------------------------------------------------------

CREATE DATABASE IF NOT EXISTS `cpanel_php_admin` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `cpanel_php_admin`;

DROP TABLE IF EXISTS `settings`;
DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(120) NOT NULL,
  `email` VARCHAR(150) NOT NULL,
  `password_hash` VARCHAR(255) NOT NULL,
  `role` ENUM('admin', 'user') NOT NULL DEFAULT 'user',
  `is_active` TINYINT(1) NOT NULL DEFAULT 1,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_users_email` (`email`),
  KEY `idx_users_role` (`role`),
  KEY `idx_users_active` (`is_active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `settings` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `key_name` VARCHAR(64) NOT NULL,
  `value_text` TEXT NOT NULL,
  `description` VARCHAR(255) DEFAULT NULL,
  `updated_by` INT UNSIGNED DEFAULT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_settings_key_name` (`key_name`),
  KEY `idx_settings_updated_by` (`updated_by`),
  CONSTRAINT `fk_settings_updated_by_user`
    FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`)
    ON UPDATE CASCADE
    ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `users` (`name`, `email`, `password_hash`, `role`, `is_active`) VALUES
('System Admin', 'admin@example.com', '$2a$12$L.2fh/TnpGC0XXIkODRtnOLLrMTnoQ0Dp/dfT.8zh9mKqq6dM5/Dm', 'admin', 1),
('Panel User', 'user@example.com', '$2a$12$sa8.rUrbnJQsnlf1AnvX9u6aUReSgoy7BfBepwOIDkxFdCfT7lZxm', 'user', 1);

INSERT INTO `settings` (`key_name`, `value_text`, `description`, `updated_by`) VALUES
('site_title', '34 Kurye Admin Panel', 'Admin panel title', 1),
('support_email', 'support@34kurye.com', 'Support contact email', 1),
('items_per_page', '10', 'Default pagination size', 1);
