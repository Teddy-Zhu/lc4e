/*
 Navicat Premium Data Transfer

 Source Server         : localhost
 Source Server Type    : MySQL
 Source Server Version : 50709
 Source Host           : localhost
 Source Database       : lc4e

 Target Server Type    : MySQL
 Target Server Version : 50709
 File Encoding         : utf-8

 Date: 10/28/2016 11:22:04 AM
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
--  Table structure for `area`
-- ----------------------------
DROP TABLE IF EXISTS `area`;
CREATE TABLE `area` (
  `id` bigint(20) NOT NULL,
  `parent_id` bigint(20) NOT NULL,
  `abbr` varchar(15) COLLATE utf8mb4_bin NOT NULL,
  `name` varchar(15) COLLATE utf8mb4_bin NOT NULL,
  `description` varchar(50) COLLATE utf8mb4_bin NOT NULL,
  `css` varchar(30) COLLATE utf8mb4_bin NOT NULL,
  `icon` varchar(30) COLLATE utf8mb4_bin NOT NULL,
  `is_publish` tinyint(1) NOT NULL DEFAULT '1',
  `is_visible` tinyint(1) NOT NULL DEFAULT '1',
  `is_close` tinyint(1) NOT NULL DEFAULT '1' COMMENT '0',
  `create_time` datetime NOT NULL,
  `update_time` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

-- ----------------------------
--  Records of `area`
-- ----------------------------
BEGIN;
INSERT INTO `area` VALUES ('1', '0', 'LC4E', 'root', '根域', '', '', '1', '1', '1', '2015-08-10 11:05:23', '2015-08-10 11:05:25'), ('2', '1', 'program', 'Program', '编程语言相关', '', '', '1', '1', '1', '2015-09-21 16:46:49', '2015-09-21 16:46:52'), ('3', '2', 'java', 'JAVA', 'java', '', '', '1', '1', '1', '2015-09-21 16:45:19', '2015-09-21 16:45:21'), ('4', '2', 'c', 'C/C++', 'C', '', '', '1', '1', '1', '2015-09-21 16:47:48', '2015-09-21 16:47:50');
COMMIT;

-- ----------------------------
--  Table structure for `comment`
-- ----------------------------
DROP TABLE IF EXISTS `comment`;
CREATE TABLE `comment` (
  `id` bigint(20) NOT NULL,
  `user_id` bigint(20) NOT NULL,
  `topic_id` bigint(20) NOT NULL,
  `refer_user` varchar(255) NOT NULL DEFAULT '',
  `refer_floor` varchar(255) NOT NULL DEFAULT '' COMMENT '回复楼层',
  `content` varchar(255) NOT NULL,
  `is_visible` tinyint(1) NOT NULL,
  `floor` int(11) NOT NULL,
  `create_time` datetime NOT NULL,
  `update_time` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
--  Table structure for `ip_forbit`
-- ----------------------------
DROP TABLE IF EXISTS `ip_forbit`;
CREATE TABLE `ip_forbit` (
  `id` bigint(20) NOT NULL,
  `ip` varchar(30) COLLATE utf8mb4_bin NOT NULL,
  `description` varchar(255) COLLATE utf8mb4_bin NOT NULL,
  `create_time` datetime NOT NULL,
  `update_time` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

-- ----------------------------
--  Table structure for `menu`
-- ----------------------------
DROP TABLE IF EXISTS `menu`;
CREATE TABLE `menu` (
  `id` bigint(20) NOT NULL,
  `parent_id` bigint(20) NOT NULL,
  `order` int(11) NOT NULL,
  `abbr` varchar(15) COLLATE utf8mb4_bin NOT NULL,
  `name` varchar(15) COLLATE utf8mb4_bin NOT NULL,
  `css` varchar(30) COLLATE utf8mb4_bin NOT NULL,
  `icon` varchar(30) COLLATE utf8mb4_bin NOT NULL,
  `create_time` datetime NOT NULL,
  `update_time` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

-- ----------------------------
--  Records of `menu`
-- ----------------------------
BEGIN;
INSERT INTO `menu` VALUES ('1', '0', '1', 'Menu', 'Menu', 'basic', 'browser', '2015-08-02 21:56:25', '2015-08-02 21:56:27'), ('2', '1', '1', '/', 'Home', 'basic', 'home', '2015-08-02 21:56:25', '2015-08-02 21:56:27'), ('3', '1', '2', '/a/think', 'Think', 'basic', 'mail', '2015-08-02 21:56:25', '2015-08-02 21:56:27'), ('4', '1', '3', '/a/random', 'Random', 'basic', 'user', '2015-08-02 21:56:25', '2015-08-02 21:56:27'), ('5', '1', '4', '/a/lan', 'Language', 'basic', 'font', '2015-08-02 21:56:25', '2015-08-02 21:56:27'), ('6', '5', '1', '/a/cc', 'C/C++', 'basic', '', '2015-08-02 21:56:25', '2015-08-02 21:56:27'), ('7', '5', '3', '/a/jvm', 'Java', 'basic', '', '2015-08-02 21:56:25', '2015-08-02 21:56:27'), ('8', '5', '2', '/a/js', 'Javascript', 'basic', '', '2015-08-02 21:56:25', '2015-08-02 21:56:27'), ('9', '5', '6', '/a/sh', 'Script', 'basic', '', '2015-08-02 21:56:25', '2015-08-02 21:56:27'), ('10', '9', '1', '/a/py', 'Python', 'basic', '', '2015-08-02 21:56:25', '2015-08-02 21:56:27'), ('11', '9', '2', '/a/rb', 'Ruby', 'basic', '', '2015-08-02 21:56:25', '2015-08-02 21:56:27'), ('12', '1', '5', '/a/py1', 'Python1', 'basic', '', '2015-08-02 21:56:25', '2015-08-02 21:56:27'), ('13', '9', '2', '/a/py2', 'Python2', 'basic', '', '2015-08-02 21:56:25', '2015-08-02 21:56:27'), ('14', '13', '3', '/a/test', 'testtitle', 'basic', '', '2015-08-02 21:56:25', '2015-08-02 21:56:27');
COMMIT;

-- ----------------------------
--  Table structure for `permission`
-- ----------------------------
DROP TABLE IF EXISTS `permission`;
CREATE TABLE `permission` (
  `id` bigint(20) NOT NULL,
  `abbr` varchar(15) COLLATE utf8mb4_bin NOT NULL,
  `name` varchar(15) COLLATE utf8mb4_bin NOT NULL,
  `description` varchar(50) COLLATE utf8mb4_bin NOT NULL,
  `is_available` tinyint(1) NOT NULL DEFAULT '1',
  `create_time` datetime NOT NULL,
  `update_time` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

-- ----------------------------
--  Records of `permission`
-- ----------------------------
BEGIN;
INSERT INTO `permission` VALUES ('1', 'view', 'view', 'asd', '1', '2015-08-07 13:06:37', '2015-08-07 13:06:40'), ('2', 'add', 'add', 'asxxawed', '1', '2015-08-07 13:06:50', '2015-08-07 13:06:53'), ('3', 'delete', 'delete', 'xckkxz', '1', '2015-08-07 13:07:06', '2015-08-07 13:07:08'), ('4', 'query', 'query', 'dsdd', '1', '2015-08-07 13:07:17', '2015-08-07 13:07:20'), ('5', 'clearcache', 'clearcache', '清缓存', '1', '2015-08-12 11:34:30', '2015-08-12 11:34:32');
COMMIT;

-- ----------------------------
--  Table structure for `role`
-- ----------------------------
DROP TABLE IF EXISTS `role`;
CREATE TABLE `role` (
  `id` bigint(20) NOT NULL,
  `abbr` varchar(15) COLLATE utf8mb4_bin NOT NULL,
  `name` varchar(15) COLLATE utf8mb4_bin NOT NULL,
  `description` varchar(50) COLLATE utf8mb4_bin NOT NULL,
  `is_available` tinyint(1) NOT NULL DEFAULT '0',
  `create_time` datetime NOT NULL,
  `update_time` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

-- ----------------------------
--  Records of `role`
-- ----------------------------
BEGIN;
INSERT INTO `role` VALUES ('1', 'admin', 'admin', 'assssdas', '1', '2016-10-24 13:59:54', null), ('2', 'member', 'meber', 'assxx', '1', '2016-10-24 13:59:57', null);
COMMIT;

-- ----------------------------
--  Table structure for `role_permission`
-- ----------------------------
DROP TABLE IF EXISTS `role_permission`;
CREATE TABLE `role_permission` (
  `id` bigint(20) NOT NULL,
  `role_id` bigint(20) NOT NULL,
  `permission_id` bigint(20) NOT NULL,
  `create_time` datetime NOT NULL,
  `update_tine` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

-- ----------------------------
--  Records of `role_permission`
-- ----------------------------
BEGIN;
INSERT INTO `role_permission` VALUES ('1', '1', '1', '2015-08-07 13:07:36', '2015-08-07 13:07:39'), ('2', '1', '3', '2015-08-07 13:07:45', '2015-08-07 13:07:48'), ('3', '1', '4', '2015-08-07 13:07:56', '2015-08-07 13:07:58'), ('4', '2', '3', '2015-08-07 13:08:05', '2015-08-07 13:08:07'), ('5', '2', '2', '2015-08-07 13:08:15', '2015-08-07 13:08:19');
COMMIT;

-- ----------------------------
--  Table structure for `sys_config`
-- ----------------------------
DROP TABLE IF EXISTS `sys_config`;
CREATE TABLE `sys_config` (
  `id` bigint(20) NOT NULL,
  `name` varchar(20) COLLATE utf8mb4_bin NOT NULL,
  `value` varchar(50) COLLATE utf8mb4_bin NOT NULL,
  `error` varchar(100) COLLATE utf8mb4_bin DEFAULT NULL,
  `description` varchar(50) COLLATE utf8mb4_bin NOT NULL,
  `create_time` datetime NOT NULL,
  `update_ime` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

-- ----------------------------
--  Records of `sys_config`
-- ----------------------------
BEGIN;
INSERT INTO `sys_config` VALUES ('1', 'SiteName', 'Light Community', '', '站点名称', '2015-08-02 22:44:43', '2015-08-02 22:44:45'), ('2', 'IndexPageSize', '20', '', '首页每页帖子数', '2015-08-02 22:45:29', '2015-08-02 22:45:32'), ('3', 'Register', '1', 'Register is forbid', '是否开放注册', '2015-08-02 22:45:55', '2015-08-02 22:45:58'), ('4', 'SimpleRegister', '0', '', '是否开启简单注册', '2015-08-02 22:46:14', '2015-08-02 22:46:16'), ('5', 'CaptchaCaseSensitive', '1', '', '验证码大小写敏感', '2015-08-11 10:31:49', '2015-08-11 10:31:51'), ('6', 'Captcha', '0', '验证码错误', '是否开启注册登录验证码', '2015-08-11 10:33:20', '2015-08-11 10:33:23'), ('7', 'UserInitBalances', '10', '', '用户初始化货币数量', '2015-08-22 11:20:32', '2015-08-22 11:20:34'), ('8', 'AreaPageSize', '20', '', '分区每页帖子数目', '2015-09-21 15:57:00', '2015-09-21 15:57:02'), ('9', 'UserTagPercent', '2', '', '用户标签权重', '2015-09-23 19:59:48', '2015-09-23 19:59:50'), ('10', 'TopicStatusPercent', '10', '', '主题状态权重', '2015-09-24 15:51:45', '2015-09-24 15:51:50'), ('11', 'CommentCountPCT', '0.5', '', '', '2015-09-24 15:52:22', '2015-09-24 15:52:24'), ('12', 'DefaultTheme', 'default', '', '主题目录', '2015-10-10 14:23:41', '2015-10-10 14:23:43'), ('13', 'Version', '1', '', '版本号', '2016-10-21 14:40:41', '2016-10-21 14:40:42');
COMMIT;

-- ----------------------------
--  Table structure for `sys_job`
-- ----------------------------
DROP TABLE IF EXISTS `sys_job`;
CREATE TABLE `sys_job` (
  `id` bigint(20) NOT NULL,
  `name` varchar(50) COLLATE utf8mb4_bin NOT NULL,
  `order` int(11) NOT NULL,
  `cron` varchar(255) COLLATE utf8mb4_bin NOT NULL,
  `class_name` varchar(255) COLLATE utf8mb4_bin NOT NULL,
  `enable` tinyint(1) NOT NULL DEFAULT '0',
  `create_time` datetime NOT NULL,
  `update_time` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

-- ----------------------------
--  Table structure for `sys_log`
-- ----------------------------
DROP TABLE IF EXISTS `sys_log`;
CREATE TABLE `sys_log` (
  `id` bigint(20) NOT NULL,
  `operate_type_id` bigint(20) NOT NULL,
  `user_id` bigint(20) NOT NULL,
  `description` varchar(255) COLLATE utf8mb4_bin NOT NULL,
  `ip` varchar(30) COLLATE utf8mb4_bin NOT NULL,
  `agant` varchar(255) COLLATE utf8mb4_bin NOT NULL,
  `create_time` datetime NOT NULL,
  `update_time` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

-- ----------------------------
--  Table structure for `tag`
-- ----------------------------
DROP TABLE IF EXISTS `tag`;
CREATE TABLE `tag` (
  `id` bigint(11) NOT NULL,
  `tag_name` varchar(10) COLLATE utf8mb4_bin NOT NULL,
  `description` varchar(50) COLLATE utf8mb4_bin NOT NULL,
  `create_time` datetime NOT NULL,
  `update_time` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

-- ----------------------------
--  Records of `tag`
-- ----------------------------
BEGIN;
INSERT INTO `tag` VALUES ('1', 'java', '', '2015-09-22 09:52:44', '2015-09-22 09:52:46'), ('2', 'c', '', '2015-09-22 09:52:55', '2015-09-22 09:52:57'), ('3', 'python', '', '2015-09-22 09:53:05', '2015-09-22 09:53:08'), ('4', 'like', '', '2015-09-23 11:17:47', '2015-09-23 11:17:50');
COMMIT;

-- ----------------------------
--  Table structure for `topic`
-- ----------------------------
DROP TABLE IF EXISTS `topic`;
CREATE TABLE `topic` (
  `id` bigint(20) NOT NULL,
  `user_id` bigint(20) NOT NULL,
  `area_id` bigint(20) NOT NULL,
  `title` varchar(255) NOT NULL,
  `content` varchar(255) NOT NULL,
  `texts` varchar(255) NOT NULL DEFAULT '',
  `is_visible` tinyint(1) NOT NULL DEFAULT '1',
  `is_close` tinyint(1) NOT NULL DEFAULT '0',
  `is_delete` tinyint(1) NOT NULL DEFAULT '0',
  `is_comment` tinyint(1) NOT NULL DEFAULT '1',
  `create_time` datetime NOT NULL,
  `update_time` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
--  Table structure for `topic_rank`
-- ----------------------------
DROP TABLE IF EXISTS `topic_rank`;
CREATE TABLE `topic_rank` (
  `id` varchar(255) NOT NULL,
  `topic_id` varchar(255) NOT NULL,
  `tags` varchar(255) NOT NULL,
  `comment_count` int(11) NOT NULL,
  `view_count` int(11) NOT NULL,
  `rank` decimal(10,3) NOT NULL DEFAULT '0.000',
  `create_time` datetime NOT NULL,
  `update_time` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
--  Table structure for `user`
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `id` varchar(11) COLLATE utf8mb4_bin NOT NULL,
  `name` varchar(12) COLLATE utf8mb4_bin NOT NULL,
  `mail` varchar(30) COLLATE utf8mb4_bin NOT NULL,
  `nick` varchar(12) COLLATE utf8mb4_bin NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_bin NOT NULL,
  `passsalt` varchar(255) COLLATE utf8mb4_bin NOT NULL,
  `web` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL,
  `birth` datetime DEFAULT NULL,
  `sign` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL,
  `balance` decimal(10,0) NOT NULL DEFAULT '0',
  `rank` decimal(10,3) NOT NULL DEFAULT '0.000',
  `phone` varchar(255) COLLATE utf8mb4_bin NOT NULL,
  `locked` tinyint(1) NOT NULL DEFAULT '1',
  `create_time` datetime NOT NULL,
  `update_ime` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

-- ----------------------------
--  Records of `user`
-- ----------------------------
BEGIN;
INSERT INTO `user` VALUES ('1', 'teddy', 'test@test.com', 'teddy', '26eb6c521db4577f34c0d1b286e5f1a1', '8d5a6dbfa7c36444c72fcb3c3ab88a83', null, null, null, '0', '0.000', '', '0', '2015-08-08 15:23:49', '2015-08-08 15:23:49'), ('2', 'test', 'test@aaa.com', 'asd', 'assaasd', 'asdsa', null, null, null, '0', '0.000', '', '0', '2015-09-23 09:38:40', '2015-09-23 09:38:42');
COMMIT;

-- ----------------------------
--  Table structure for `user_area_keep`
-- ----------------------------
DROP TABLE IF EXISTS `user_area_keep`;
CREATE TABLE `user_area_keep` (
  `id` bigint(20) NOT NULL,
  `user_id` bigint(20) NOT NULL,
  `area_id` bigint(20) NOT NULL,
  `create_time` datetime NOT NULL,
  `update_time` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

-- ----------------------------
--  Table structure for `user_blocked`
-- ----------------------------
DROP TABLE IF EXISTS `user_blocked`;
CREATE TABLE `user_blocked` (
  `id` bigint(20) NOT NULL,
  `user_id` bigint(20) NOT NULL,
  `blocked_user_id` bigint(20) NOT NULL,
  `create_time` datetime NOT NULL,
  `update_time` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

-- ----------------------------
--  Table structure for `user_followed`
-- ----------------------------
DROP TABLE IF EXISTS `user_followed`;
CREATE TABLE `user_followed` (
  `id` bigint(20) NOT NULL,
  `user_id` bigint(20) NOT NULL,
  `followed_user_id` bigint(20) NOT NULL,
  `create_time` datetime NOT NULL,
  `update_time` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

-- ----------------------------
--  Table structure for `user_message`
-- ----------------------------
DROP TABLE IF EXISTS `user_message`;
CREATE TABLE `user_message` (
  `id` bigint(20) NOT NULL,
  `user_id` bigint(20) NOT NULL,
  `dest_user_id` bigint(20) NOT NULL,
  `is_read` tinyint(1) NOT NULL DEFAULT '0',
  `content` varchar(100) COLLATE utf8mb4_bin NOT NULL,
  `create_time` datetime NOT NULL,
  `update_time` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

-- ----------------------------
--  Table structure for `user_permission`
-- ----------------------------
DROP TABLE IF EXISTS `user_permission`;
CREATE TABLE `user_permission` (
  `id` bigint(20) NOT NULL,
  `user_id` bigint(20) NOT NULL,
  `permission_id` bigint(20) NOT NULL,
  `end_time` datetime NOT NULL,
  `create_time` datetime NOT NULL,
  `update_time` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
--  Table structure for `user_role`
-- ----------------------------
DROP TABLE IF EXISTS `user_role`;
CREATE TABLE `user_role` (
  `id` bigint(20) NOT NULL,
  `user_id` bigint(20) NOT NULL,
  `role_id` bigint(20) NOT NULL,
  `end_time` datetime NOT NULL,
  `create_time` datetime NOT NULL,
  `update_time` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

-- ----------------------------
--  Records of `user_role`
-- ----------------------------
BEGIN;
INSERT INTO `user_role` VALUES ('1', '1', '1', '2015-08-16 11:58:07', '2015-08-07 11:58:09', '2015-08-07 11:59:55'), ('2', '1', '2', '2015-08-08 13:05:04', '2015-08-07 13:05:13', '2015-08-07 13:05:16');
COMMIT;

-- ----------------------------
--  Table structure for `user_social`
-- ----------------------------
DROP TABLE IF EXISTS `user_social`;
CREATE TABLE `user_social` (
  `id` bigint(20) NOT NULL,
  `user_id` bigint(20) NOT NULL,
  `province` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL,
  `city` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL,
  `region` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL,
  `street` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL,
  `github` varchar(50) COLLATE utf8mb4_bin DEFAULT NULL,
  `twitter` varchar(50) COLLATE utf8mb4_bin DEFAULT NULL,
  `facebook` varchar(50) COLLATE utf8mb4_bin DEFAULT NULL,
  `google` varchar(50) COLLATE utf8mb4_bin DEFAULT NULL,
  `qq` varchar(12) COLLATE utf8mb4_bin DEFAULT NULL,
  `create_time` datetime NOT NULL,
  `update_time` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

-- ----------------------------
--  Table structure for `user_tag`
-- ----------------------------
DROP TABLE IF EXISTS `user_tag`;
CREATE TABLE `user_tag` (
  `id` bigint(20) NOT NULL,
  `user_id` bigint(20) NOT NULL,
  `tag_id` bigint(20) NOT NULL,
  `rank` decimal(10,3) NOT NULL DEFAULT '0.000',
  `create_time` datetime NOT NULL,
  `update_time` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
--  Table structure for `user_topic_blocked`
-- ----------------------------
DROP TABLE IF EXISTS `user_topic_blocked`;
CREATE TABLE `user_topic_blocked` (
  `id` bigint(20) NOT NULL,
  `topic_id` bigint(20) NOT NULL,
  `user_id` bigint(20) NOT NULL,
  `create_time` datetime NOT NULL,
  `update_time` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

-- ----------------------------
--  Records of `user_topic_blocked`
-- ----------------------------
BEGIN;
INSERT INTO `user_topic_blocked` VALUES ('1', '2', '2', '2015-09-23 10:08:30', '2015-09-23 10:08:33');
COMMIT;

-- ----------------------------
--  Table structure for `user_topic_keep`
-- ----------------------------
DROP TABLE IF EXISTS `user_topic_keep`;
CREATE TABLE `user_topic_keep` (
  `id` bigint(20) NOT NULL,
  `topic_id` bigint(20) NOT NULL,
  `user_id` bigint(20) NOT NULL,
  `create_time` datetime NOT NULL,
  `update_time` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

-- ----------------------------
--  View structure for `vw_user_permission`
-- ----------------------------
DROP VIEW IF EXISTS `vw_user_permission`;
CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `vw_user_permission` AS select `user`.`name` AS `user_name`,`user_permission`.`end_time` AS `permission_end_time`,`permission`.`abbr` AS `permission_abbr`,`permission`.`is_available` AS `permission_is_available` from ((`user` left join `user_permission` on((`user`.`id` = `user_permission`.`user_id`))) left join `permission` on((`user_permission`.`permission_id` = `permission`.`id`)));

-- ----------------------------
--  View structure for `vw_user_role_permission`
-- ----------------------------
DROP VIEW IF EXISTS `vw_user_role_permission`;
CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `vw_user_role_permission` AS select `role`.`abbr` AS `role_abbr`,`permission`.`abbr` AS `permission_abbr`,`user`.`name` AS `user_name`,`role`.`is_available` AS `role_is_available`,`permission`.`is_available` AS `permission_is_available`,`user_role`.`end_time` AS `role_end_time` from ((((`user` left join `user_role` on((`user`.`id` = `user_role`.`user_id`))) left join `role` on((`role`.`id` = `user_role`.`role_id`))) left join `role_permission` on((`role_permission`.`role_id` = `role`.`id`))) left join `permission` on((`permission`.`id` = `role_permission`.`permission_id`)));

SET FOREIGN_KEY_CHECKS = 1;
