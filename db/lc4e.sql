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

 Date: 11/18/2016 16:34:17 PM
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
INSERT INTO `area` VALUES ('1', '0', 'LC4E', 'root', '根域', '', '', '0', '1', '1', '2015-08-10 11:05:23', '2015-08-10 11:05:25'), ('2', '1', 'program', 'Program', '编程语言相关', '', '', '1', '1', '0', '2015-09-21 16:46:49', '2015-09-21 16:46:52'), ('3', '2', 'java', 'JAVA', 'java', '', '', '1', '1', '0', '2015-09-21 16:45:19', '2015-09-21 16:45:21'), ('4', '2', 'cc', 'C/C++', 'C', '', '', '1', '1', '0', '2015-09-21 16:47:48', '2015-09-21 16:47:50');
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
INSERT INTO `menu` VALUES ('1', '0', '1', 'Menu', 'Menu', 'basic', 'browser', '2015-08-02 21:56:25', '2015-08-02 21:56:27'), ('2', '1', '1', '/', '主页', 'basic', 'home', '2015-08-02 21:56:25', '2015-08-02 21:56:27'), ('4', '1', '3', '/a/program', '程序', 'basic', 'user', '2015-08-02 21:56:25', '2015-08-02 21:56:27'), ('5', '1', '4', '/a/lan', '语言', 'basic', 'font', '2015-08-02 21:56:25', '2015-08-02 21:56:27'), ('6', '5', '1', '/a/cc', 'C/C++', 'basic', '', '2015-08-02 21:56:25', '2015-08-02 21:56:27'), ('7', '5', '3', '/a/java', 'Java', 'basic', '', '2015-08-02 21:56:25', '2015-08-02 21:56:27'), ('8', '5', '2', '/a/js', 'Javascript', 'basic', '', '2015-08-02 21:56:25', '2015-08-02 21:56:27');
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
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `abbr` varchar(15) COLLATE utf8mb4_bin NOT NULL,
  `name` varchar(15) COLLATE utf8mb4_bin NOT NULL,
  `description` varchar(50) COLLATE utf8mb4_bin NOT NULL,
  `is_available` tinyint(1) NOT NULL DEFAULT '0',
  `create_time` datetime NOT NULL,
  `update_time` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

-- ----------------------------
--  Records of `role`
-- ----------------------------
BEGIN;
INSERT INTO `role` VALUES ('1', 'admin', '管理员', '管理员', '1', '2016-10-24 13:59:54', null), ('2', 'member', '普通用户', '普通用户', '1', '2016-10-24 13:59:57', null);
COMMIT;

-- ----------------------------
--  Table structure for `role_permission`
-- ----------------------------
DROP TABLE IF EXISTS `role_permission`;
CREATE TABLE `role_permission` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `role_id` bigint(20) NOT NULL,
  `permission_id` bigint(20) NOT NULL,
  `create_time` datetime NOT NULL,
  `update_tine` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

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
INSERT INTO `sys_config` VALUES ('1', 'SiteName', 'Light Community', '', '站点名称', '2015-08-02 22:44:43', '2015-08-02 22:44:45'), ('2', 'IndexPageSize', '20', '', '首页每页帖子数', '2015-08-02 22:45:29', '2015-08-02 22:45:32'), ('3', 'Register', 'true', 'Register is forbid', '是否开放注册', '2015-08-02 22:45:55', '2015-08-02 22:45:58'), ('4', 'SimpleRegister', 'false', '', '是否开启简单注册', '2015-08-02 22:46:14', '2015-08-02 22:46:16'), ('5', 'CaptchaCaseSensitive', 'true', '', '验证码大小写敏感', '2015-08-11 10:31:49', '2015-08-11 10:31:51'), ('6', 'Captcha', 'false', '验证码错误', '是否开启注册登录验证码', '2015-08-11 10:33:20', '2015-08-11 10:33:23'), ('7', 'UserInitBalances', '10', '', '用户初始化货币数量', '2015-08-22 11:20:32', '2015-08-22 11:20:34'), ('8', 'AreaPageSize', '10', '', '分区每页帖子数目', '2015-09-21 15:57:00', '2015-09-21 15:57:02'), ('9', 'UserTagPercent', '2', '', '用户标签权重', '2015-09-23 19:59:48', '2015-09-23 19:59:50'), ('10', 'TopicStatusPercent', '10', '', '主题状态权重', '2015-09-24 15:51:45', '2015-09-24 15:51:50'), ('11', 'CommentCountPCT', '0.5', '', '', '2015-09-24 15:52:22', '2015-09-24 15:52:24'), ('12', 'DefaultTheme', 'default', '', '主题目录', '2015-10-10 14:23:41', '2015-10-10 14:23:43'), ('13', 'Version', '1', '', '版本号', '2016-10-21 14:40:41', '2016-10-21 14:40:42'), ('14', 'RegisterReward', '10', null, '注册奖励', '2016-10-28 16:02:20', '2016-10-28 16:02:22'), ('15', 'Avatar', '//cdn.v2ex.co/gravatar/{md5}?s=48&d=wavatar', null, '头像地址', '2016-11-02 12:58:38', '2016-11-02 12:58:40'), ('16', 'PublishTopicInterval', '600', null, '发帖间隔时间', '2016-11-03 13:12:45', '2016-11-03 13:12:47'), ('17', 'RegisterInitialUser', 'member', null, '初始化注册用户类型', '2016-11-10 10:23:59', null), ('18', 'UserInitialRank', '1', null, '用户初始化rank', '2016-11-10 11:16:22', null);
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
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `url` varchar(255) NOT NULL,
  `user_id` bigint(20) NOT NULL,
  `area_id` bigint(20) NOT NULL,
  `title` varchar(255) NOT NULL,
  `content` varchar(5000) NOT NULL,
  `texts` varchar(255) NOT NULL DEFAULT '',
  `is_visible` tinyint(1) NOT NULL DEFAULT '1',
  `is_close` tinyint(1) NOT NULL DEFAULT '0',
  `is_delete` tinyint(1) NOT NULL DEFAULT '0',
  `is_comment` tinyint(1) NOT NULL DEFAULT '1',
  `create_time` datetime NOT NULL,
  `update_time` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
--  Records of `topic`
-- ----------------------------
BEGIN;
INSERT INTO `topic` VALUES ('1', ' ', '1', '2', '第一篇文章', '爱范儿致电苹果广州天环广场零售店了解到的信息是：从 11 月 2 日起，只有通过大陆官网或苹果零售店购买的苹果设备，才能在大陆“天才吧”进行维修，从电商平台或其他线下渠道购买的苹果设备，即使是国行的机器，也只能前往第三方授权维修点进行维修。   苹果深圳益田假日广场店、北京三里屯店的相关人员也证实了这一说法，但他们表示这一政策还未完全落实，因此暂未正式对外公布。而按照新规定，在“天才吧”维修时一定要出具相关购买凭证，如发票、收据或包装盒等。   苹果官网的客服则表示他们目前仍未接到相关通知，具体执行以零售店的说法为准。   via ： http://www.ifanr.com/741293', 'hot', '1', '0', '0', '1', '2016-11-09 02:48:49', null), ('2', ' ', '1', '3', '分布式锁总结', '<a href=\"/asd\">xxx</a>\n1 设置锁超时时间\nredis、数据库等实现的分布式锁，需要设置锁超时时间的原因在于：其他客户端无法得知已经获取锁的客户端的状态\n是挂了呢，还是正在执行。所以只能傻傻的设置一个超时，认为超时之后就**简单的**判定获取锁的客户端挂了。\n\n一旦锁设定了超时时间，可能获取锁的客户端因各种原因执行业务操作的时候耗时较长，超出了锁的超时时间，这时其他客户端就可以再次获取锁了，所以就会带来并发问题。\n\n2 消除锁超时时间\n为了消除这个锁超时，就需要由服务器来作为代理来通知，\n\n如ZooKeeper，一旦客户端挂了，就会删除对应的临时节点，然后通知watch该节点的其他客户端。所以客户端不需要设置锁超时，就等待通知即可。\n\n从这点来说ZooKeeper是更可靠的，降低了因锁超时带来的并发问题。\n\n3 方案的高可用问题\nredis、数据库等方案要想实现高可用，则必须有对应的高可用方案。如最简单的主从架构，又引入了一致性的问题，又会有很多的坑。\n\nZooKeeper方案本身可以做到高可用、一致性，所以ZooKeeper方案也更简单一些。\n\n4 连接的单点问题\n这个单点不是说redis或zookeeper的单点问题，而是客户端和服务器端的这个连接的单点问题。先来举个例子：\n\n如ZooKeeper还是会出现并发问题的，如客户端获取到锁了之后，和ZooKeeper连接出现了session超时，\n就会导致ZooKeeper集群删除对应的临时节点，其他客户端也就能获取到锁了，此时就存在并发问题。\n\n这种问题的根由就是：客户端和ZooKeeper集群之间的连接是单连接，即只连接其中的一台机器。一旦该连接出现网络抖动，\n这种分布式锁方案也会出现并发问题。\n\n减少并发的措施：增大session的超时时间，尽量减少网络抖动，但是这也会降低服务器端对客户端的状态检测的灵敏度，这个灵敏度在分布式锁的场景下也不是特别重要，所以无所谓了。\n\n5 消除连接的单点问题\n要消除单点，必然是建立多连接来防止网络的抖动，即客户端连接多个服务器端，向每个服务器都执行获取锁的操作。\n\n如redis的Redlock实现的分布式锁。\n\n有N个独立的master服务器，客户端会向所有的服务器发送获取锁的操作。过半的服务器都获取到锁了则认为获取到锁了，这种也有很多细节。这种方式就解决了上述所说的ZooKeeper单连接可能造成的并发问题。\n\n然而redis由于上述1所说的redis自身设计的问题，Redlock实现的分布式锁也会有锁超时问题，即也会存在并发。\n\n所以**理想中更好的方案**就是：**解决了上述2个问题，从而来进一步减少并发的可能性**。\n\nredis如果能像ZooKeeper一样，实现了和客户端绑定的临时key，一旦redis客户端挂了，临时key删除，通知watch该key的其他客户端（感觉这个是一个不错的需求，不知redis未来是否要实现），就可以消除锁超时，再使用Redlock实现的分布式锁，这时候可靠性就更高了。\n\n本文侧重总结在可靠性方面的问题，性能嘛，单机的redis当然是最快的了，其次zookeeper，最后数据库。而上述第五点，Redlock方案牺牲了一些性能来换取了可靠性。\n\n6 概览分布式锁\n其实要解决2个高可用的问题：\n\n数据存储的高可用（解决基本使用）\n\n如使用redis、数据库、ZooKeeper，他们承载着分布式锁需要的数据，不能是单点的，要集群高可用\n\n连接的高可用（降低并发的概率）\n\n那就需要建立多连接，如向N个redis master建立连接，向每一个都获取锁。\n\n所以应该理想的布局是：\n\n和N个独立的服务器（如ZooKeeper）都建立连接，向每台服务器都请求获取锁的操作，过半成功才表示获取到锁\n\n这N个独立的服务器既有数据的保障，又有多连接的保障。所以简单来说，应该和3个独立的ZooKeeper机器都建立连接，而不是这3台构成一个ZooKeeper集群。\n\nfrom https://yq.aliyun.com/articles/63130', '', '1', '0', '0', '1', '2016-11-10 20:57:46', null), ('3', ' ', '1', '3', 'Javaç®ä»', '    Javaæ¯ä¸é¨é¢åå¯¹è±¡ç¼ç¨è¯­è¨ï¼ä¸ä»å¸æ¶äºC++è¯­è¨çåç§ä¼ç¹ï¼è¿æå¼äºC++éé¾ä»¥çè§£çå¤ç»§æ¿ãæéç­æ¦å¿µï¼å æ­¤Javaè¯­è¨å·æåè½å¼ºå¤§åç®åæç¨ä¸¤ä¸ªç¹å¾ã\n    Javaè¯­è¨ä½ä¸ºéæé¢åå¯¹è±¡ç¼ç¨è¯­è¨çä»£è¡¨ï¼æå¥½å°å®ç°äºé¢åå¯¹è±¡çè®ºï¼åè®¸ç¨åºåä»¥ä¼éçæç»´æ¹å¼è¿è¡å¤æçç¼ç¨[1]  ã\n    Javaå·æç®åæ§ãé¢åå¯¹è±¡ãåå¸å¼ãå¥å£®æ§ãå®å¨æ§ãå¹³å°ç¬ç«ä¸å¯ç§»æ¤æ§ãå¤çº¿ç¨ãå¨ææ§ç­ç¹ç¹[2]  ã\n    Javaå¯ä»¥ç¼åæ¡é¢åºç¨ç¨åºãWebåºç¨ç¨åºãåå¸å¼ç³»ç»ååµå¥å¼ç³»ç»åºç¨ç¨åºç­[3]  ã', '', '1', '0', '0', '1', '2016-11-16 01:49:35', null), ('4', ' ', '1', '4', 'C++', '   C++æ¯Cè¯­è¨çç»§æ¿ï¼å®æ¢å¯ä»¥è¿è¡Cè¯­è¨çè¿ç¨åç¨åºè®¾è®¡ï¼åå¯ä»¥è¿è¡ä»¥æ½è±¡æ°æ®ç±»åä¸ºç¹ç¹çåºäºå¯¹è±¡çç¨åºè®¾è®¡ï¼è¿å¯ä»¥è¿è¡ä»¥ç»§æ¿åå¤æä¸ºç¹ç¹çé¢åå¯¹è±¡çç¨åºè®¾è®¡ãC++æé¿é¢åå¯¹è±¡ç¨åºè®¾è®¡çåæ¶ï¼è¿å¯ä»¥è¿è¡åºäºè¿ç¨çç¨åºè®¾è®¡ï¼å èC++å°±éåºçé®é¢è§æ¨¡èè®ºï¼å¤§å°ç±ä¹ã[1] \n   C++ä¸ä»æ¥æè®¡ç®æºé«æè¿è¡çå®ç¨æ§ç¹å¾ï¼åæ¶è¿è´åäºæé«å¤§è§æ¨¡ç¨åºçç¼ç¨è´¨éä¸ç¨åºè®¾è®¡è¯­è¨çé®é¢æè¿°è½å.', '', '1', '0', '0', '1', '2016-11-16 01:56:07', null), ('5', ' ', '1', '4', 'c%E8%AF%AD%E8%A8%80', '%20%20C%E8%AF%AD%E8%A8%80%E6%98%AF%E4%B8%80%E9%97%A8%E9%80%9A%E7%94%A8%E8%AE%A1%E7%AE%97%E6%9C%BA%E7%BC%96%E7%A8%8B%E8%AF%AD%E8%A8%80%EF%BC%8C%E5%BA%94%E7%94%A8%E5%B9%BF%E6%B3%9B%E3%80%82C%E8%AF%AD%E8%A8%80%E7%9A%84%E8%AE%BE%E8%AE%A1%E7%9B%AE%E6%A0%87%E6%98%AF%E6%8F%90%E4%BE%9B%E4%B8%80%E7%A7%8D%E8%83%BD%E4%BB%A5%E7%AE%80%E6%98%93%E7%9A%84%E6%96%B9%E5%BC%8F%E7%BC%96%E8%AF%91%E3%80%81%E5%A4%84%E7%90%86%E4%BD%8E%E7%BA%A7%E5%AD%98%E5%82%A8%E5%99%A8%E3%80%81%E4%BA%A7%E7%94%9F%E5%B0%91%E9%87%8F%E7%9A%84%E6%9C%BA%E5%99%A8%E7%A0%81%E4%BB%A5%E5%8F%8A%E4%B8%8D%E9%9C%80%E8%A6%81%E4%BB%BB%E4%BD%95%E8%BF%90%E8%A1%8C%E7%8E%AF%E5%A2%83%E6%94%AF%E6%8C%81%E4%BE%BF%E8%83%BD%E8%BF%90%E8%A1%8C%E7%9A%84%E7%BC%96%E7%A8%8B%E8%AF%AD%E8%A8%80%E3%80%82%0A%E5%B0%BD%E7%AE%A1C%E8%AF%AD%E8%A8%80%E6%8F%90%E4%BE%9B%E4%BA%86%E8%AE%B8%E5%A4%9A%E4%BD%8E%E7%BA%A7%E5%A4%84%E7%90%86%E7%9A%84%E5%8A%9F%E8%83%BD%EF%BC%8C%E4%BD%86%E4%BB%8D%E7%84%B6%E4%BF%9D%E6%8C%81%E7%9D%80%E8%89%AF%E5%A5%BD%E8%B7%A8%E5%B9%B3%E5%8F%B0%E7%9A%84%E7%89%B9%E6%80%A7%EF%BC%8C%E4%BB%A5%E4%B8%80%E4%B8%AA%E6%A0%87%E5%87%86%E8%A7%84%E6%A0%BC%E5%86%99%E5%87%BA%E7%9A%84C%E8%AF%AD%E8%A8%80%E7%A8%8B%E5%BA%8F%E5%8F%AF%E5%9C%A8%E8%AE%B8%E5%A4%9A%E7%94%B5%E8%84%91%E5%B9%B3%E5%8F%B0%E4%B8%8A%E8%BF%9B%E8%A1%8C%E7%BC%96%E8%AF%91%EF%BC%8C%E7%94%9A%E8%87%B3%E5%8C%85%E5%90%AB%E4%B8%80%E4%BA%9B%E5%B5%8C%E5%85%A5%E5%BC%8F%E5%A4%84%E7%90%86%E5%99%A8%EF%BC%88%E5%8D%95%E7%89%87%E6%9C%BA%E6%88%96%E7%A7%B0MCU%EF%BC%89%E4%BB%A5%E5%8F%8A%E8%B6%85%E7%BA%A7%E7%94%B5%E8%84%91%E7%AD%89%E4%BD%9C%E4%B8%9A%E5%B9%B3%E5%8F%B0%E3%80%82%0A%20%20%E4%BA%8C%E5%8D%81%E4%B8%96%E7%BA%AA%E5%85%AB%E5%8D%81%E5%B9%B4%E4%BB%A3%EF%BC%8C%E4%B8%BA%E4%BA%86%E9%81%BF%E5%85%8D%E5%90%84%E5%BC%80%E5%8F%91%E5%8E%82%E5%95%86%E7%94%A8%E7%9A%84C%E8%AF%AD%E8%A8%80%E8%AF%AD%E6%B3%95%E4%BA%A7%E7%94%9F%E5%B7%AE%E5%BC%82%EF%BC%8C%E7%94%B1%E7%BE%8E%E5%9B%BD%E5%9B%BD%E5%AE%B6%E6%A0%87%E5%87%86%E5%B1%80%E4%B8%BAC%E8%AF%AD%E8%A8%80%E8%AE%A2%E5%AE%9A%E4%BA%86%E4%B8%80%E5%A5%97%E5%AE%8C%E6%95%B4%E7%9A%84%E5%9B%BD%E9%99%85%E6%A0%87%E5%87%86%E8%AF%AD%E6%B3%95%EF%BC%8C%E7%A7%B0%E4%B8%BAANSI%20C%EF%BC%8C%E4%BD%9C%E4%B8%BAC%E8%AF%AD%E8%A8%80%E6%9C%80%E5%88%9D%E7%9A%84%E6%A0%87%E5%87%86%E3%80%82', '', '1', '0', '0', '1', '2016-11-16 02:13:39', null), ('6', ' ', '1', '2', 'æµè¯ä¸­æ', 'æµè¯ä¸­æ', '', '1', '0', '0', '1', '2016-11-16 02:17:49', null), ('7', ' ', '1', '4', 'c++æµè¯', 'ä¸­ææµè¯', '', '1', '0', '0', '1', '2016-11-16 02:31:16', null), ('8', ' ', '1', '2', '中文测试', '中文测试中文测试', '', '1', '0', '0', '1', '2016-11-16 19:34:02', null), ('9', ' ', '1', '2', '程序 （管理名词）', '    在国标《质量管理体系 基础和术语》GB/T19000—2008/ISO9000：2005中第3.4.5条 程序procedure中对于“程序”的定义进行了规定。\n    一个环节，内部嵌套着一系列复杂的列逻辑慎密的一个组件，如若一个地方出问题则会影响到整个主体（可以理解为事务）。', '', '1', '0', '0', '1', '2016-11-16 19:37:31', null), ('10', ' ', '1', '2', '计算机程序', '    《计算机软件保护条例》第三条规定：计算机程序，是指为了得到某种结果而可以由计算机等具有信息处理能力的装置执行的代码化指令序列，或者可以被自动转换成代码化指令序列的符号化指令序列或  者符号化语句序列。\n    同一计算机程序的源程序和目标程序为同一作品。\n计算机程序是由数据结构和算法构成的。', '', '1', '0', '0', '1', '2016-11-16 19:40:08', null), ('11', ' ', '1', '2', 'Ehcache使用的参数说明', '参数说明：\n\n<diskStore>：当内存缓存中对象数量超过maxElementsInMemory时,将缓存对象写到磁盘缓存中(需对象实现序列化接口)。\n\n<diskStore path=\"\">：用来配置磁盘缓存使用的物理路径,Ehcache磁盘缓存使用的文件后缀名是*.data和*.index。\n\nname：缓存名称,cache的唯一标识(ehcache会把这个cache放到HashMap里)。\n\nmaxElementsOnDisk：磁盘缓存中最多可以存放的元素数量,0表示无穷大。\n\nmaxElementsInMemory：内存缓存中最多可以存放的元素数量,若放入Cache中的元素超过这个数值,则有以下两种情况。\n\n1)若overflowToDisk=true,则会将Cache中多出的元素放入磁盘文件中。\n\n2)若overflowToDisk=false,则根据memoryStoreEvictionPolicy策略替换Cache中原有的元素。\n\nEternal：缓存中对象是否永久有效,即是否永驻内存,true时将忽略timeToIdleSeconds和timeToLiveSeconds。\n\ntimeToIdleSeconds：缓存数据在失效前的允许闲置时间(单位:秒),仅当eternal=false时使用,默认值是0表示可闲置时间无穷大,此为可选属性即访问这个cache中元素的最大间隔时间,若超过这个时间没有访问此Cache中的某个元素,那么此元素将被从Cache中清除。\n\ntimeToLiveSeconds：缓存数据在失效前的允许存活时间(单位:秒),仅当eternal=false时使用,默认值是0表示可存活时间无穷大，即Cache中的某元素从创建到清楚的生存时间,也就是说从创建开始计时,当超过这个时间时,此元素将从Cache中清除。\n\noverflowToDisk：内存不足时,是否启用磁盘缓存(即内存中对象数量达到maxElementsInMemory时,Ehcache会将对象写到磁盘中)，会根据标签中path值查找对应的属性值,写入磁盘的文件会放在path文件夹下,文件的名称是cache的名称,后缀名是data。\n\ndiskPersistent：是否持久化磁盘缓存,当这个属性的值为true时,系统在初始化时会在磁盘中查找文件名为cache名称,后缀名为index的文件，这个文件中存放了已经持久化在磁盘中的cache的index,找到后会把cache加载到内存，要想把cache真正持久化到磁盘,写程序时注意执行net.sf.ehcache.Cache.put(Element element)后要调用flush()方法。\n\ndiskExpiryThreadIntervalSeconds：磁盘缓存的清理线程运行间隔,默认是120秒。\n\ndiskSpoolBufferSizeMB：设置DiskStore（磁盘缓存）的缓存区大小,默认是30MB\n\nmemoryStoreEvictionPolicy：内存存储与释放策略,即达到maxElementsInMemory限制时,Ehcache会根据指定策略清理内存，共有三种策略,分别为LRU(最近最少使用)、LFU(最常用的)、FIFO(先进先出)。', '', '1', '0', '0', '1', '2016-11-16 19:57:05', null), ('12', ' ', '1', '2', '存储总量达20T的MySQL实例，如何完成迁移？', '一. 测试用例/过程\n\n目前开发商上云（外部MySQL迁移到CDB）提供多种方案，其中开发商的MySQL实例有外网IP的可以直接使用腾讯云数据库迁移工具完成迁移（其他的迁移方法参见链接本次迁移任务中该开发商的所有MySQL实例均有外网代理IP供使用，故直接选用迁移工具完成数据导入。\n\n迁移工具的基本原理：通过待迁移实例提供的高权限帐号获取源实例基本的MySQL实例配置，并同步到目标CDB实例；通过mysqldump直接将源实例导出传输到CDB实例后导入；源数据库实例和目标CDB建立主从关系同步新数据。其中CDB实例与源IDC之间通过NAT方式以一台带外网的服务器为中转发起通信。', '', '1', '0', '0', '1', '2016-11-16 23:10:43', null), ('13', ' ', '1', '2', 'Nginx 1.11.6 发布，高性能 Web 服务器', 'Nginx 1.11.6 发布了，Nginx 是一款轻量级的Web 服务器／反向代理服务器及电子邮件（IMAP/POP3）代理服务器，并在一个BSD-like 协议下发行。\n\n主要更新如下：\n\n$ssl_client_s_dn 和 $ssl_client_i_dn 变量的格式已更改为遵循RFC 2253（RFC 4514）标准；旧格式的值在 $ssl_client_s_dn_legacy 和 $ssl_client_i_dn_legacy 变量中可用\n\n当将临时文件存储在缓存目录中时，它们会被存储在与相应缓存文件相同的子目录中，而不是临时文件的单独子目录\n\n认证机制支持邮件代理\n\n在 ngx_http_image_filter_module 中支持 WebP \n\n在“proxy_method”指令中支持变量\n\n', '', '1', '0', '0', '1', '2016-11-16 23:17:51', null);
COMMIT;

-- ----------------------------
--  Table structure for `topic_rank`
-- ----------------------------
DROP TABLE IF EXISTS `topic_rank`;
CREATE TABLE `topic_rank` (
  `id` bigint(255) NOT NULL AUTO_INCREMENT,
  `topic_id` bigint(255) NOT NULL,
  `tags` varchar(255) NOT NULL,
  `comment_count` int(11) NOT NULL,
  `view_count` int(11) NOT NULL,
  `rank` decimal(10,3) NOT NULL DEFAULT '0.000',
  `create_time` datetime NOT NULL,
  `update_time` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
--  Records of `topic_rank`
-- ----------------------------
BEGIN;
INSERT INTO `topic_rank` VALUES ('1', '1', '苹果,相关,维修,零售店', '0', '0', '0.000', '2016-11-09 02:49:03', null), ('2', '2', 'ZooKeeper,客户端,问题,超时', '0', '0', '0.000', '2016-11-10 20:57:46', null), ('3', '3', 'Web,Java', '0', '0', '0.000', '2016-11-16 01:49:35', null), ('4', '4', '', '0', '0', '0.000', '2016-11-16 01:56:07', null), ('5', '6', '', '0', '0', '0.000', '2016-11-16 02:17:49', null), ('6', '7', '', '0', '0', '0.000', '2016-11-16 02:31:17', null), ('7', '8', '测试,中文', '0', '0', '0.000', '2016-11-16 19:34:02', null), ('8', '9', '程序,问题,地方,组件', '0', '0', '0.000', '2016-11-16 19:37:32', null), ('9', '10', '计算机程序,序列,指令,代码', '0', '39', '0.000', '2016-11-16 19:40:08', null), ('10', '11', '缓存,磁盘,内存,Cache', '0', '3', '0.000', '2016-11-16 19:57:05', null), ('11', '12', '实例,迁移,MySQL,CDB', '0', '1', '0.000', '2016-11-16 23:10:43', null), ('12', '13', '变量,代理,服务器,文件', '0', '38', '0.000', '2016-11-16 23:17:51', null);
COMMIT;

-- ----------------------------
--  Table structure for `user`
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `id` bigint(11) NOT NULL AUTO_INCREMENT,
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
  `update_time` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

-- ----------------------------
--  Records of `user`
-- ----------------------------
BEGIN;
INSERT INTO `user` VALUES ('1', 'teddy', '304445056@qq.com', 'teddy', '5d992daa2dad5fe45c893a9a45236d42', 'e91ee9193789b841d7855e55fcf55667', null, null, null, '10', '1.000', '17712877316', '0', '2016-11-10 20:14:40', null);
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
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) NOT NULL,
  `role_id` bigint(20) NOT NULL,
  `end_time` datetime NOT NULL,
  `create_time` datetime NOT NULL,
  `update_time` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

-- ----------------------------
--  Records of `user_role`
-- ----------------------------
BEGIN;
INSERT INTO `user_role` VALUES ('1', '1', '2', '3016-11-10 20:14:40', '2016-11-10 20:14:40', null);
COMMIT;

-- ----------------------------
--  Table structure for `user_social`
-- ----------------------------
DROP TABLE IF EXISTS `user_social`;
CREATE TABLE `user_social` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) NOT NULL,
  `province` varchar(255) COLLATE utf8mb4_bin NOT NULL DEFAULT '',
  `city` varchar(255) COLLATE utf8mb4_bin NOT NULL DEFAULT '',
  `region` varchar(255) COLLATE utf8mb4_bin NOT NULL DEFAULT '',
  `street` varchar(255) COLLATE utf8mb4_bin NOT NULL DEFAULT '',
  `github` varchar(50) COLLATE utf8mb4_bin NOT NULL DEFAULT '',
  `twitter` varchar(50) COLLATE utf8mb4_bin NOT NULL DEFAULT '',
  `facebook` varchar(50) COLLATE utf8mb4_bin NOT NULL DEFAULT '',
  `google` varchar(50) COLLATE utf8mb4_bin NOT NULL DEFAULT '',
  `qq` varchar(12) COLLATE utf8mb4_bin NOT NULL DEFAULT '',
  `create_time` datetime NOT NULL,
  `update_time` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

-- ----------------------------
--  Records of `user_social`
-- ----------------------------
BEGIN;
INSERT INTO `user_social` VALUES ('1', '1', '', '', '', '', '', '', '', '', '', '2016-11-10 20:14:40', null);
COMMIT;

-- ----------------------------
--  Table structure for `user_tag`
-- ----------------------------
DROP TABLE IF EXISTS `user_tag`;
CREATE TABLE `user_tag` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
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
--  View structure for `vw_comment_detail`
-- ----------------------------
DROP VIEW IF EXISTS `vw_comment_detail`;
CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `vw_comment_detail` AS select `comment`.`floor` AS `floor`,`comment`.`is_visible` AS `is_visible`,`comment`.`content` AS `content`,`comment`.`create_time` AS `create_time`,`comment`.`update_time` AS `update_time`,`cmuser`.`nick` AS `nick`,`cmuser`.`id` AS `id`,`cmuser`.`mail` AS `mail`,`comment`.`topic_id` AS `topic_id` from (`comment` left join `user` `cmuser` on((`cmuser`.`id` = `comment`.`user_id`)));

-- ----------------------------
--  View structure for `vw_topic_detail`
-- ----------------------------
DROP VIEW IF EXISTS `vw_topic_detail`;
CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `vw_topic_detail` AS select `topic`.`title` AS `title`,`topic`.`content` AS `content`,`topic`.`texts` AS `texts`,`topic`.`id` AS `id`,`topic`.`url` AS `url`,`topic`.`create_time` AS `create_time`,`topic`.`update_time` AS `update_time`,`author`.`id` AS `author_id`,`author`.`nick` AS `author_nick`,`author`.`mail` AS `author_mail`,`topic`.`area_id` AS `area_id`,`topic_rank`.`view_count` AS `view_count`,`topic_rank`.`comment_count` AS `comment_count`,`topic_rank`.`tags` AS `tags`,`area`.`abbr` AS `area_abbr` from (((`topic` left join `user` `author` on((`author`.`id` = `topic`.`user_id`))) left join `topic_rank` on((`topic_rank`.`topic_id` = `topic`.`id`))) left join `area` on((`area`.`id` = `topic`.`area_id`)));

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
