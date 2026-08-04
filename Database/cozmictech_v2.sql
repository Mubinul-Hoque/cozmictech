-- Database: cozmictech_v2
-- Industry Standard Schema Design with Page Sections Architecture
-- This script creates the new structure and ports data from the old `cozmictech` database.

CREATE DATABASE IF NOT EXISTS `cozmictech_v2`;
USE `cozmictech_v2`;

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

-- --------------------------------------------------------
-- 1. USERS & AUTHENTICATION
-- --------------------------------------------------------
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `image` varchar(255) DEFAULT NULL,
  `role` varchar(50) NOT NULL DEFAULT 'Admin',
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY `idx_users_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `users` (`id`, `username`, `email`, `password`, `image`, `role`, `created_at`)
SELECT `id`, `username`, `email`, `password`, `image`, `role`, `date`
FROM `cozmictech`.`user`;

-- --------------------------------------------------------
-- 2. CMS ARCHITECTURE: SETTINGS, PAGES, PAGE_SECTIONS
-- --------------------------------------------------------
CREATE TABLE `settings` (
  `setting_key` varchar(100) NOT NULL PRIMARY KEY,
  `setting_group` varchar(50) DEFAULT NULL,
  `setting_value` text DEFAULT NULL,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Migrate global settings from old `homepage` and `contact`
INSERT INTO `settings` (`setting_key`, `setting_group`, `setting_value`)
SELECT 'company_title', 'global', `company_title` FROM `cozmictech`.`homepage` LIMIT 1;
INSERT INTO `settings` (`setting_key`, `setting_group`, `setting_value`)
SELECT 'slogan', 'global', `slogan` FROM `cozmictech`.`homepage` LIMIT 1;
INSERT INTO `settings` (`setting_key`, `setting_group`, `setting_value`)
SELECT 'logo', 'global', `logo` FROM `cozmictech`.`homepage` LIMIT 1;
INSERT INTO `settings` (`setting_key`, `setting_group`, `setting_value`)
SELECT 'favicon', 'global', `favicon` FROM `cozmictech`.`homepage` LIMIT 1;
INSERT INTO `settings` (`setting_key`, `setting_group`, `setting_value`)
SELECT 'theme', 'global', `theme` FROM `cozmictech`.`homepage` LIMIT 1;

-- Address and Contact info
INSERT INTO `settings` (`setting_key`, `setting_group`, `setting_value`)
SELECT 'contact_address', 'contact', `address` FROM `cozmictech`.`contact` LIMIT 1;
INSERT INTO `settings` (`setting_key`, `setting_group`, `setting_value`)
SELECT 'contact_phone', 'contact', `phone` FROM `cozmictech`.`contact` LIMIT 1;
INSERT INTO `settings` (`setting_key`, `setting_group`, `setting_value`)
SELECT 'contact_cell', 'contact', `cell` FROM `cozmictech`.`contact` LIMIT 1;
INSERT INTO `settings` (`setting_key`, `setting_group`, `setting_value`)
SELECT 'contact_email', 'contact', `email` FROM `cozmictech`.`contact` LIMIT 1;
INSERT INTO `settings` (`setting_key`, `setting_group`, `setting_value`)
SELECT 'contact_email2', 'contact', `email2` FROM `cozmictech`.`contact` LIMIT 1;
INSERT INTO `settings` (`setting_key`, `setting_group`, `setting_value`)
SELECT 'contact_map', 'contact', `map` FROM `cozmictech`.`contact` LIMIT 1;


CREATE TABLE `page_sections` (
  `id` int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `page_slug` varchar(100) NOT NULL,
  `section_key` varchar(50) NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `subtitle_or_tag` text DEFAULT NULL,
  `content` text DEFAULT NULL,
  `image` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`image`)),
  `icon` varchar(100) DEFAULT NULL,
  `counter_number` varchar(50) DEFAULT NULL,
  `sort_order` int(11) DEFAULT 0,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- MIGRATING HOMEPAGE SECTIONS
-- Assuming page_id 1 is HOME based on `cozmictech`.`pages`
INSERT INTO `page_sections` (`page_slug`, `section_key`, `image`, `sort_order`)
SELECT 'home', 'hero_slider', `hero_images`, 0 FROM `cozmictech`.`homepage` WHERE `hero_images` IS NOT NULL LIMIT 1;

INSERT INTO `page_sections` (`page_slug`, `section_key`, `title`, `content`, `image`, `sort_order`)
SELECT 'home', 'glance', `glance_title`, `glance_description`, `glance_img`, 1 FROM `cozmictech`.`homepage` LIMIT 1;

INSERT INTO `page_sections` (`page_slug`, `section_key`, `title`, `counter_number`, `sort_order`)
SELECT 'home', 'experience', `Exp_title`, `exp_year`, 2 FROM `cozmictech`.`homepage` LIMIT 1;

INSERT INTO `page_sections` (`page_slug`, `section_key`, `title`, `counter_number`, `sort_order`)
SELECT 'home', 'projects', `pro_title`, `pro_nos`, 3 FROM `cozmictech`.`homepage` LIMIT 1;

INSERT INTO `page_sections` (`page_slug`, `section_key`, `title`, `subtitle_or_tag`, `sort_order`)
SELECT 'home', 'services_intro', `title3`, `tag3`, 6 FROM `cozmictech`.`homepage` LIMIT 1;

INSERT INTO `page_sections` (`page_slug`, `section_key`, `title`, `subtitle_or_tag`, `sort_order`)
SELECT 'home', 'strength_intro', `title4`, `tag4`, 7 FROM `cozmictech`.`homepage` LIMIT 1;

INSERT INTO `page_sections` (`page_slug`, `section_key`, `title`, `subtitle_or_tag`, `sort_order`)
SELECT 'home', 'testimonials_intro', `title5`, `tag5`, 8 FROM `cozmictech`.`homepage` LIMIT 1;

INSERT INTO `page_sections` (`page_slug`, `section_key`, `title`, `subtitle_or_tag`, `sort_order`)
SELECT 'home', 'recent_blog_intro', `title6`, `tag6`, 9 FROM `cozmictech`.`homepage` LIMIT 1;

INSERT INTO `page_sections` (`page_slug`, `section_key`, `title`, `content`, `image`, `sort_order`)
SELECT 'home', 'sustainable', `title7`, `content7`, `image7`, 10 FROM `cozmictech`.`homepage` LIMIT 1;

INSERT INTO `page_sections` (`page_slug`, `section_key`, `title`, `content`, `image`, `sort_order`)
SELECT 'home', 'building_tech', `title8`, `content8`, `image8`, 11 FROM `cozmictech`.`homepage` LIMIT 1;

INSERT INTO `page_sections` (`page_slug`, `section_key`, `title`, `content`, `image`, `sort_order`)
SELECT 'home', 'career_intro', `title9`, `content9`, `image9`, 12 FROM `cozmictech`.`homepage` LIMIT 1;

-- MIGRATING ABOUT US SECTIONS
-- Assuming page_id 2 is ABOUT
INSERT INTO `page_sections` (`page_slug`, `section_key`, `title`, `content`, `subtitle_or_tag`, `sort_order`)
SELECT 'about', 'our_story', `story_title`, `story_body`, `story_body2`, 1 FROM `cozmictech`.`about_us` LIMIT 1;

INSERT INTO `page_sections` (`page_slug`, `section_key`, `title`, `content`, `sort_order`)
SELECT 'about', 'mission', `mission_title`, `mission_body`, 2 FROM `cozmictech`.`about_us` LIMIT 1;

INSERT INTO `page_sections` (`page_slug`, `section_key`, `title`, `content`, `sort_order`)
SELECT 'about', 'vision', `vision_title`, `vision_body`, 3 FROM `cozmictech`.`about_us` LIMIT 1;

INSERT INTO `page_sections` (`page_slug`, `section_key`, `title`, `content`, `sort_order`)
SELECT 'about', 'our_team_intro', `team_title`, `team_description`, 4 FROM `cozmictech`.`about_us` LIMIT 1;


-- --------------------------------------------------------
-- 3. CATEGORIES, SECTORS, CLIENTS
-- --------------------------------------------------------
CREATE TABLE `categories` (
  `id` int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `name` varchar(100) NOT NULL,
  `type` varchar(50) DEFAULT 'project',
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `categories` (`id`, `name`, `type`)
SELECT `id`, `name`, 'project' FROM `cozmictech`.`category`;

INSERT INTO `categories` (`name`, `type`)
SELECT `name`, 'post' FROM `cozmictech`.`post_category`;

INSERT INTO `categories` (`name`, `type`)
SELECT `category_name`, 'message' FROM `cozmictech`.`message_category`;


CREATE TABLE `sectors` (
  `id` int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `name` varchar(100) NOT NULL,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `sectors` (`id`, `name`)
SELECT `id`, `sector` FROM `cozmictech`.`sectors`;


CREATE TABLE `clients` (
  `id` int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `client_name` varchar(255) NOT NULL,
  `logo` varchar(255) DEFAULT NULL,
  `country` varchar(100) DEFAULT NULL,
  `email` varchar(150) DEFAULT NULL,
  `phone` varchar(50) DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `category_id` int(11) DEFAULT NULL,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_clients_category` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `clients` (`id`, `client_name`, `logo`, `country`, `email`, `phone`, `location`, `category_id`)
SELECT `id`, `client_name`, `logo`, `country`, `email`, `phone`, `location`, `client_cat` FROM `cozmictech`.`clients`;

-- --------------------------------------------------------
-- 4. PROJECTS
-- --------------------------------------------------------
CREATE TABLE `projects` (
  `id` int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `sector_id` int(11) DEFAULT NULL,
  `client_id` int(11) DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `images_json` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`images_json`)),
  `description` text,
  `status` enum('Ongoing','Completed') NOT NULL DEFAULT 'Completed',
  `services_rendered` text DEFAULT NULL,
  `project_cost` varchar(100) DEFAULT NULL,
  `service_cost` varchar(100) DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `feature` varchar(255) DEFAULT NULL,
  `story` varchar(100) DEFAULT NULL,
  `area` varchar(100) DEFAULT NULL,
  `height` varchar(100) DEFAULT NULL,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_projects_sector` FOREIGN KEY (`sector_id`) REFERENCES `sectors` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_projects_client` FOREIGN KEY (`client_id`) REFERENCES `clients` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `projects` (`id`, `sector_id`, `client_id`, `title`, `images_json`, `description`, `status`, `services_rendered`, `project_cost`, `service_cost`, `location`, `feature`, `story`, `area`, `height`, `start_date`, `end_date`)
SELECT `id`, `sector_id`, `client_id`, `title`, `images`, `description`, `status`, `services`, `project_cost`, `service_cost`, `location`, `feature`, `story`, `area`, `height`, `start_date`, `end_date` FROM `cozmictech`.`projects`;

CREATE TABLE `project_categories_link` (
  `project_id` int(11) NOT NULL,
  `category_id` int(11) NOT NULL,
  PRIMARY KEY (`project_id`, `category_id`),
  CONSTRAINT `fk_pcl_project` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_pcl_category` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT IGNORE INTO `project_categories_link` (`project_id`, `category_id`)
SELECT `project_id`, `category_id` FROM `cozmictech`.`project_categories`;


-- --------------------------------------------------------
-- 5. CAREERS & TEAM
-- --------------------------------------------------------
CREATE TABLE `careers` (
  `id` int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `post` varchar(150) NOT NULL,
  `location` varchar(150) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `vacancy` int(11) DEFAULT 1,
  `employment_status` varchar(50) DEFAULT 'Full-Time',
  `experience` varchar(255) DEFAULT NULL,
  `salary` varchar(100) DEFAULT 'Negotiable',
  `gender` varchar(50) DEFAULT 'Any',
  `deadline` date DEFAULT NULL,
  `description` text,
  `responsibilities` text,
  `education_quality` text,
  `other_benefits` text,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `careers` (`id`, `post`, `location`, `image`, `vacancy`, `employment_status`, `experience`, `salary`, `gender`, `deadline`, `description`, `responsibilities`, `education_quality`, `other_benefits`, `is_active`, `created_at`)
SELECT `id`, `post`, `location`, `image`, `vacancy`, `emp_status`, `experience`, `salary`, `gender`, `deadline`, `description`, `responsibilities`, `Edu_Qlty`, `other_beninifs`, IF(`status` = 'Active', 1, 0), `published` FROM `cozmictech`.`career`;

CREATE TABLE `team_members` (
  `id` int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `name` varchar(100) NOT NULL,
  `designation` varchar(100) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `message` text,
  `facebook_url` varchar(255) DEFAULT NULL,
  `instagram_url` varchar(255) DEFAULT NULL,
  `linkedin_url` varchar(255) DEFAULT NULL,
  `twitter_url` varchar(255) DEFAULT NULL,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `team_members` (`id`, `name`, `designation`, `image`, `message`, `facebook_url`, `instagram_url`, `linkedin_url`, `twitter_url`)
SELECT `id`, `name`, `designation`, `image`, `message`, `fb_link`, `insta_link`, `linkedin_link`, `twitter` FROM `cozmictech`.`team`;


-- --------------------------------------------------------
-- 6. SERVICES, STRENGTHS, TESTIMONIALS
-- --------------------------------------------------------
CREATE TABLE `services` (
  `id` int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `name` varchar(255) NOT NULL,
  `icon` varchar(100) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `short_description` text,
  `description` text,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `services` (`id`, `name`, `icon`, `image`, `short_description`, `description`)
SELECT `id`, `name`, `icon`, `image`, `short_description`, `description` FROM `cozmictech`.`services`;

CREATE TABLE `strengths` (
  `id` int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `title` varchar(255) NOT NULL,
  `icon` varchar(100) DEFAULT NULL,
  `content` text,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `strengths` (`id`, `title`, `icon`, `content`)
SELECT `id`, `title`, `icon`, `content` FROM `cozmictech`.`strength`;

CREATE TABLE `testimonials` (
  `id` int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `name` varchar(255) NOT NULL,
  `designation` varchar(255) DEFAULT NULL,
  `company` varchar(255) DEFAULT NULL,
  `stars` tinyint(4) DEFAULT 5,
  `image` varchar(255) DEFAULT NULL,
  `story` text NOT NULL,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `testimonials` (`id`, `name`, `designation`, `company`, `stars`, `image`, `story`)
SELECT `id`, `name`, `designation`, `company`, `stars`, `image`, `story` FROM `cozmictech`.`testimonials`;


-- --------------------------------------------------------
-- 7. BLOG (POSTS) & MESSAGES
-- --------------------------------------------------------
CREATE TABLE `posts` (
  `id` int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `category_id` int(11) DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `content` text,
  `image` varchar(255) DEFAULT NULL,
  `author_name` varchar(100) DEFAULT NULL,
  `published_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_posts_category` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT IGNORE INTO `posts` (`id`, `title`, `content`, `image`, `author_name`, `created_at`, `published_at`, `category_id`)
SELECT p.`id`, p.`title`, p.`content`, p.`image`, p.`author`, p.`date`, STR_TO_DATE(p.`sdate`, '%d-%m-%Y'), c.`id` 
FROM `cozmictech`.`posts` p
LEFT JOIN `cozmictech`.`post_category` old_c ON p.`post_catid` = old_c.`id`
LEFT JOIN `categories` c ON c.`name` = old_c.`name` AND c.`type` = 'post';

CREATE TABLE `messages` (
  `id` int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `category_id` int(11) DEFAULT NULL,
  `name` varchar(150) NOT NULL,
  `email` varchar(150) NOT NULL,
  `company` varchar(150) DEFAULT NULL,
  `subject` varchar(255) DEFAULT NULL,
  `message` text NOT NULL,
  `is_read` tinyint(1) DEFAULT 0,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_messages_category` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT IGNORE INTO `messages` (`id`, `name`, `email`, `company`, `subject`, `message`, `is_read`, `created_at`, `category_id`)
SELECT m.`id`, m.`name`, m.`email`, m.`company`, m.`subject`, m.`message`, m.`status`, m.`date`, c.`id`
FROM `cozmictech`.`messages` m
LEFT JOIN `cozmictech`.`message_category` old_c ON m.`message_cat_id` = old_c.`id`
LEFT JOIN `categories` c ON c.`name` = old_c.`category_name` AND c.`type` = 'message';


CREATE TABLE `social_links` (
  `id` int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `platform_name` varchar(100) NOT NULL,
  `icon` varchar(100) DEFAULT NULL,
  `url` varchar(255) NOT NULL,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `social_links` (`id`, `platform_name`, `icon`, `url`)
SELECT `id`, `name`, `icon`, `link` FROM `cozmictech`.`social`;

COMMIT;
