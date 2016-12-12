/*
 Navicat Premium Data Transfer

 Source Server         : localhost
 Source Server Type    : MySQL
 Source Server Version : 50716
 Source Host           : localhost
 Source Database       : lc4e

 Target Server Type    : MySQL
 Target Server Version : 50716
 File Encoding         : utf-8

 Date: 12/10/2016 08:56:37 AM
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
  `css` varchar(30) COLLATE utf8mb4_bin DEFAULT NULL,
  `icon` varchar(30) COLLATE utf8mb4_bin DEFAULT NULL,
  `is_publish` tinyint(1) NOT NULL DEFAULT '1',
  `is_visible` tinyint(1) NOT NULL DEFAULT '1',
  `is_close` tinyint(1) NOT NULL DEFAULT '1' COMMENT '0',
  `create_time` datetime NOT NULL,
  `update_time` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

-- ----------------------------
--  Records of `area`
-- ----------------------------
BEGIN;
INSERT INTO `area` VALUES ('1', '0', 'LC4E', 'root', '根域', '', '', '0', '1', '1', '2015-08-10 11:05:23', '2015-08-10 11:05:25'), ('2', '1', 'program', 'Program', '编程语言相关', '', '', '1', '1', '0', '2015-09-21 16:46:49', '2015-09-21 16:46:52'), ('3', '2', 'java', 'JAVA', 'java', '', '', '1', '1', '0', '2015-09-21 16:45:19', '2015-09-21 16:45:21'), ('4', '2', 'cc', 'C/C++', 'C', '', '', '1', '1', '0', '2015-09-21 16:47:48', '2015-09-21 16:47:50'), ('5', '1', 'markdown', 'Markdown', 'markdown相关', ' ', null, '1', '1', '0', '2016-12-08 16:11:08', null);
COMMIT;

-- ----------------------------
--  Table structure for `comment`
-- ----------------------------
DROP TABLE IF EXISTS `comment`;
CREATE TABLE `comment` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) NOT NULL,
  `topic_id` bigint(20) NOT NULL,
  `refer_user` varchar(32) NOT NULL DEFAULT '',
  `refer_floor` varchar(32) NOT NULL DEFAULT '' COMMENT '回复楼层',
  `content` varchar(1000) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `texts` varchar(100) NOT NULL DEFAULT '',
  `is_visible` tinyint(1) NOT NULL,
  `down` int(11) NOT NULL DEFAULT '0',
  `create_time` datetime NOT NULL,
  `update_time` datetime DEFAULT NULL,
  `top` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
--  Records of `comment`
-- ----------------------------
BEGIN;
INSERT INTO `comment` VALUES ('1', '1', '1', '', '', 'my reply', '', '1', '0', '2016-12-08 09:11:19', null, '0'), ('2', '1', '1', '', '', ':) emoji', '', '1', '0', '2016-12-08 09:17:39', null, '0'), ('3', '1', '2', '', '', 'test 回复', '', '1', '0', '2016-12-09 09:21:43', null, '0'), ('4', '1', '2', '', '', '😀 emoji 测试', '', '1', '0', '2016-12-09 11:12:12', null, '0'), ('5', '1', '2', '', '', '👻 markdown', '', '1', '0', '2016-12-09 11:25:10', null, '0'), ('6', '2', '2', '', '', '评论一下 😸 ', '', '1', '0', '2016-12-09 11:54:03', null, '0'), ('7', '1', '3', '', '', '2016年诺贝尔物理学奖揭晓 三位美国科学家获奖】当地时间10月4日，诺贝尔物理学奖评委会在斯德哥尔摩的瑞典皇家科学院宣布，2016年诺贝尔物理学奖物理学奖授予三位美国科学家：戴维·索利斯、邓肯·霍尔丹和迈克尔·科斯特利茨，以表彰他们在理论上发现了物质的拓扑相变和拓扑相', '', '1', '0', '2016-12-09 11:57:38', null, '0'), ('8', '1', '3', '', '', '🎥 Record ~', '', '1', '0', '2016-12-09 12:07:27', null, '0'), ('9', '1', '3', '', '', '😈 Reply Test', '', '1', '0', '2016-12-09 12:08:51', null, '0'), ('10', '1', '3', '', '', '🍜🍧 前排花生瓜子', '', '1', '0', '2016-12-09 12:11:50', null, '0'), ('11', '1', '2', '', '', '😳 目瞪口呆', '', '1', '0', '2016-12-09 12:17:32', null, '0');
COMMIT;

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
  `css` varchar(30) COLLATE utf8mb4_bin DEFAULT NULL,
  `icon` varchar(30) COLLATE utf8mb4_bin DEFAULT NULL,
  `create_time` datetime NOT NULL,
  `update_time` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

-- ----------------------------
--  Records of `menu`
-- ----------------------------
BEGIN;
INSERT INTO `menu` VALUES ('1', '0', '1', 'Menu', 'Menu', 'basic', 'browser', '2015-08-02 21:56:25', '2015-08-02 21:56:27'), ('2', '1', '1', '/', '主页', 'basic', 'home', '2015-08-02 21:56:25', '2015-08-02 21:56:27'), ('4', '1', '3', '/a/program', '程序', 'basic', 'user', '2015-08-02 21:56:25', '2015-08-02 21:56:27'), ('5', '1', '4', '/a/lan', '语言', 'basic', 'font', '2015-08-02 21:56:25', '2015-08-02 21:56:27'), ('6', '5', '1', '/a/cc', 'C/C++', 'basic', '', '2015-08-02 21:56:25', '2015-08-02 21:56:27'), ('7', '5', '3', '/a/java', 'Java', 'basic', '', '2015-08-02 21:56:25', '2015-08-02 21:56:27'), ('8', '5', '2', '/a/js', 'Javascript', 'basic', '', '2015-08-02 21:56:25', '2015-08-02 21:56:27'), ('9', '1', '2', '/a/markdown', 'Markdown', 'basic', null, '2016-12-08 16:12:15', null);
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
--  Table structure for `statistic`
-- ----------------------------
DROP TABLE IF EXISTS `statistic`;
CREATE TABLE `statistic` (
  `id` bigint(20) NOT NULL,
  `topic_count` bigint(20) NOT NULL DEFAULT '0',
  `user_count` bigint(20) NOT NULL DEFAULT '0',
  `create_time` datetime NOT NULL,
  `update_time` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
--  Table structure for `sys_config`
-- ----------------------------
DROP TABLE IF EXISTS `sys_config`;
CREATE TABLE `sys_config` (
  `id` bigint(20) NOT NULL,
  `name` varchar(20) COLLATE utf8mb4_bin NOT NULL,
  `value` varchar(50) COLLATE utf8mb4_bin NOT NULL DEFAULT '',
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
INSERT INTO `sys_config` VALUES ('1', 'SiteName', 'Light Community', '', '站点名称', '2015-08-02 22:44:43', '2015-08-02 22:44:45'), ('2', 'IndexPageSize', '20', '', '首页每页帖子数', '2015-08-02 22:45:29', '2015-08-02 22:45:32'), ('3', 'Register', 'true', 'Register is forbid', '是否开放注册', '2015-08-02 22:45:55', '2015-08-02 22:45:58'), ('4', 'SimpleRegister', 'false', '', '是否开启简单注册', '2015-08-02 22:46:14', '2015-08-02 22:46:16'), ('5', 'CaptchaCaseSensitive', 'true', '', '验证码大小写敏感', '2015-08-11 10:31:49', '2015-08-11 10:31:51'), ('6', 'Captcha', 'false', '验证码错误', '是否开启注册登录验证码', '2015-08-11 10:33:20', '2015-08-11 10:33:23'), ('7', 'UserInitBalances', '10', '', '用户初始化货币数量', '2015-08-22 11:20:32', '2015-08-22 11:20:34'), ('8', 'AreaPageSize', '10', '', '分区每页帖子数目', '2015-09-21 15:57:00', '2015-09-21 15:57:02'), ('9', 'UserTagPercent', '2', '', '用户标签权重', '2015-09-23 19:59:48', '2015-09-23 19:59:50'), ('10', 'TopicStatusPercent', '10', '', '主题状态权重', '2015-09-24 15:51:45', '2015-09-24 15:51:50'), ('11', 'CommentCountPCT', '0.5', '', '', '2015-09-24 15:52:22', '2015-09-24 15:52:24'), ('12', 'DefaultTheme', 'default', '', '主题目录', '2015-10-10 14:23:41', '2015-10-10 14:23:43'), ('13', 'Version', '1', '', '版本号', '2016-10-21 14:40:41', '2016-10-21 14:40:42'), ('14', 'RegisterReward', '10', null, '注册奖励', '2016-10-28 16:02:20', '2016-10-28 16:02:22'), ('15', 'Avatar', '//cdn.v2ex.com/gravatar/{md5}?s=48&d=wavatar', null, '头像地址', '2016-11-02 12:58:38', '2016-11-02 12:58:40'), ('16', 'PublishTopicInterval', '600', null, '发帖间隔时间', '2016-11-03 13:12:45', '2016-11-03 13:12:47'), ('17', 'RegisterInitialUser', 'member', null, '初始化注册用户类型', '2016-11-10 10:23:59', null), ('18', 'UserInitialRank', '1', null, '用户初始化rank', '2016-11-10 11:16:22', null), ('19', 'TopicUrlSalt', '!@$%cvh5463#', null, '主题url生成salt', '2016-11-22 09:40:49', null), ('20', 'CommentSize', '20', null, 'comment的页大小', '2016-12-02 14:50:45', null), ('21', 'ShowLastMonthTopic', '3', null, '展示最近几个月的主题', '2016-12-08 15:32:22', null), ('22', 'ReplyReward', '1', null, '回复奖励', '2016-12-09 15:20:44', null), ('23', 'TagBlocked', '', null, '禁用的标签', '2016-12-09 15:36:19', null);
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
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
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
  `id` bigint(11) NOT NULL AUTO_INCREMENT,
  `tag_name` varchar(10) COLLATE utf8mb4_bin NOT NULL,
  `description` varchar(50) COLLATE utf8mb4_bin DEFAULT NULL,
  `create_time` datetime NOT NULL,
  `update_time` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `tag_id_uindex` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

-- ----------------------------
--  Records of `tag`
-- ----------------------------
BEGIN;
INSERT INTO `tag` VALUES ('1', 'https', null, '2016-12-08 09:07:55', null), ('2', 'github', null, '2016-12-08 09:07:55', null), ('3', 'com', null, '2016-12-08 09:07:55', null), ('4', 'text', null, '2016-12-08 09:07:55', null), ('5', 'JavaScript', null, '2016-12-09 09:12:08', null), ('6', '浏览器', null, '2016-12-09 09:12:08', null), ('7', '语言', null, '2016-12-09 09:12:08', null), ('8', 'Netscape', null, '2016-12-09 09:12:08', null), ('9', '拓扑', null, '2016-12-09 11:52:23', null), ('10', '物质', null, '2016-12-09 11:52:23', null), ('11', '相变', null, '2016-12-09 11:52:23', null), ('12', '研究', null, '2016-12-09 11:52:23', null), ('13', '标准', null, '2016-12-09 12:20:47', null), ('14', '美国', null, '2016-12-09 12:20:47', null), ('15', '发表', null, '2016-12-09 12:20:47', null);
COMMIT;

-- ----------------------------
--  Table structure for `topic`
-- ----------------------------
DROP TABLE IF EXISTS `topic`;
CREATE TABLE `topic` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `url` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` bigint(20) NOT NULL,
  `area_id` bigint(20) NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `content` varchar(5000) COLLATE utf8mb4_unicode_ci NOT NULL,
  `texts` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `is_visible` tinyint(1) NOT NULL DEFAULT '1',
  `is_close` tinyint(1) NOT NULL DEFAULT '0',
  `is_delete` tinyint(1) NOT NULL DEFAULT '0',
  `is_comment` tinyint(1) NOT NULL DEFAULT '1',
  `tags` varchar(32) COLLATE utf8mb4_unicode_ci DEFAULT '',
  `top` int(11) NOT NULL DEFAULT '0',
  `down` int(11) NOT NULL DEFAULT '0',
  `comment_count` int(11) NOT NULL DEFAULT '0',
  `view_count` int(11) DEFAULT '0',
  `rank` decimal(10,2) NOT NULL DEFAULT '0.00',
  `last_comment_user_id` bigint(20) DEFAULT NULL,
  `last_comment_time` datetime DEFAULT NULL,
  `create_time` datetime NOT NULL,
  `update_time` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  FULLTEXT KEY `tags` (`tags`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
--  Records of `topic`
-- ----------------------------
BEGIN;
INSERT INTO `topic` VALUES ('1', 'Dlon', '1', '5', 'Markdown Test', '---\n__Advertisement :)__\n\n- __[pica](https://nodeca.github.io/pica/demo/)__ - high quality and fast image\n  resize in browser.\n- __[babelfish](https://github.com/nodeca/babelfish/)__ - developer friendly\n  i18n with plurals support and easy syntax.\n\nYou will like those projects!\n\n---\n\n# h1 Heading 8-)\n## h2 Heading\n### h3 Heading\n#### h4 Heading\n##### h5 Heading\n###### h6 Heading\n\n\n## Horizontal Rules\n\n___\n\n---\n\n***\n\n\n## Typographic replacements\n\nEnable typographer option to see result.\n\n(c) (C) (r) (R) (tm) (TM) (p) (P) +-\n\ntest.. test... test..... test?..... test!....\n\n!!!!!! ???? ,,  -- ---\n\n\"Smartypants, double quotes\" and \'single quotes\'\n\n\n## Emphasis\n\n**This is bold text**\n\n__This is bold text__\n\n*This is italic text*\n\n_This is italic text_\n\n~~Strikethrough~~\n\n\n## Blockquotes\n\n\n> Blockquotes can also be nested...\n>> ...by using additional greater-than signs right next to each other...\n> > > ...or with spaces between arrows.\n\n\n## Lists\n\nUnordered\n\n+ Create a list by starting a line with `+`, `-`, or `*`\n+ Sub-lists are made by indenting 2 spaces:\n  - Marker character change forces new list start:\n    * Ac tristique libero volutpat at\n    + Facilisis in pretium nisl aliquet\n    - Nulla volutpat aliquam velit\n+ Very easy!\n\nOrdered\n\n1. Lorem ipsum dolor sit amet\n2. Consectetur adipiscing elit\n3. Integer molestie lorem at massa\n\n\n1. You can use sequential numbers...\n1. ...or keep all the numbers as `1.`\n\nStart numbering with offset:\n\n57. foo\n1. bar\n\n\n## Code\n\nInline `code`\n\nIndented code\n\n    // Some comments\n    line 1 of code\n    line 2 of code\n    line 3 of code\n\n\nBlock code \"fences\"\n\n```\nSample text here...\n```\n\nSyntax highlighting\n\n``` js\nvar foo = function (bar) {\n  return bar++;\n};\n\nconsole.log(foo(5));\n```\n\n## Tables\n\n| Option | Description |\n| ------ | ----------- |\n| data   | path to data files to supply the data that will be passed into templates. |\n| engine | engine to be used for processing templates. Handlebars is the default. |\n| ext    | extension to be used for dest files. |\n\nRight aligned columns\n\n| Option | Description |\n| ------:| -----------:|\n| data   | path to data files to supply the data that will be passed into templates. |\n| engine | engine to be used for processing templates. Handlebars is the default. |\n| ext    | extension to be used for dest files. |\n\n\n## Links\n\n[link text](http://dev.nodeca.com)\n\n[link with title](http://nodeca.github.io/pica/demo/ \"title text!\")\n\nAutoconverted link https://github.com/nodeca/pica (enable linkify to see)\n\n\n## Images\n\n![Minion](https://octodex.github.com/images/minion.png)\n![Stormtroopocat](https://octodex.github.com/images/stormtroopocat.jpg \"The Stormtroopocat\")\n\nLike links, Images also have a footnote style syntax\n\n![Alt text][id]\n\nWith a reference later in the document defining the URL location:\n\n[id]: https://octodex.github.com/images/dojocat.jpg  \"The Dojocat\"\n\n\n## Plugins\n\nThe killer feature of `markdown-it` is very effective support of\n[syntax plugins](https://www.npmjs.org/browse/keyword/markdown-it-plugin).\n\n\n### [Emojies](https://github.com/markdown-it/markdown-it-emoji)\n\n> Classic markup: :wink: :crush: :cry: :tear: :laughing: :yum:\n>\n> Shortcuts (emoticons): :-) :-( 8-) ;)\n\nsee [how to change output](https://github.com/markdown-it/markdown-it-emoji#change-output) with twemoji.\n\n\n### [Subscript](https://github.com/markdown-it/markdown-it-sub) / [Superscript](https://github.com/markdown-it/markdown-it-sup)\n\n- 19^th^\n- H~2~O\n\n\n### [\\<ins>](https://github.com/markdown-it/markdown-it-ins)\n\n++Inserted text++\n\n\n### [\\<mark>](https://github.com/markdown-it/markdown-it-mark)\n\n==Marked text==\n\n\n### [Footnotes](https://github.com/markdown-it/markdown-it-footnote)\n\nFootnote 1 link[^first].\n\nFootnote 2 link[^second].\n\nInline footnote^[Text of inline footnote] definition.\n\nDuplicated footnote reference[^second].\n\n[^first]: Footnote **can have markup**\n\n    and multiple paragraphs.\n\n[^second]: Footnote text.\n\n\n### [Definition lists](https://github.com/markdown-it/markdown-it-deflist)\n\nTerm 1\n\n:   Definition 1\nwith lazy continuation.\n\nTerm 2 with *inline markup*\n\n:   Definition 2\n\n        { some code, part of Definition 2 }\n\n    Third paragraph of definition 2.\n\n_Compact style:_\n\nTerm 1\n  ~ Definition 1\n\nTerm 2\n  ~ Definition 2a\n  ~ Definition 2b\n\n\n### [Abbreviations](https://github.com/markdown-it/markdown-it-abbr)\n\nThis is HTML abbreviation example.\n\nIt converts \"HTML\", but keep intact partial entries like \"xxxHTMLyyy\" and so on.\n\n*[HTML]: Hyper Text Markup Language\n\n### [Custom containers](https://github.com/markdown-it/markdown-it-container)\n\n::: warning\n*here be dragons*\n:::\n', '', '1', '0', '0', '1', 'https,github,com,text', '0', '0', '4', '37', '0.00', '1', '2016-12-09 11:25:10', '2016-12-08 09:07:26', null), ('2', '4ywD', '1', '2', 'javascript', '\n          JavaScript一种直译式脚本语言，是一种动态类型、弱类型、基于原型的语言，内置支持类型。它的解释器被称为JavaScript引擎，为浏览器的一部分，广泛用于客户端的脚本语言，最早是在HTML（标准通用标记语言下的一个应用）网页上使用，用来给HTML网页增加动态功能。\n          在1995年时，由Netscape公司的Brendan Eich，在网景导航者浏览器上首次设计实现而成。因为Netscape与Sun合作，Netscape管理层希望它外观看起来像Java，因此取名为JavaScript。但实际上它的语法风格与Self及Scheme较为接近。\n         为了取得技术优势，微软推出了JScript，CEnvi推出ScriptEase，与JavaScript同样可在浏览器上运行。为了统一规格，因为JavaScript兼容于ECMA标准，因此也称为ECMAScript。\n', '', '1', '0', '0', '1', 'JavaScript,浏览器,语言,Netscape', '0', '0', '5', '43', '0.00', '1', '2016-12-09 12:17:32', '2016-12-09 09:12:04', null), ('3', '73qn', '2', '2', '拓扑相变😱', '###### 拓扑相变是一种特殊的、没有对称破缺的相变，这种相变无法用朗道对称性破缺理论解释，拓扑数可以用来表征拓扑相变。\n\n拓扑相变\n----\n>2016年10月4日，诺贝尔物理学奖评委会在斯德哥尔摩的瑞典皇家科学院宣布，2016年诺贝尔物理学奖物理学奖授予三位美国科学家：戴维·索利斯、邓肯·霍尔丹和迈克尔·科斯特利茨，以表彰他们在理论上发现了物质的拓扑相变和拓扑相。\n>>获奖者打开了一个未知的世界，物质可以以一种奇怪的状态存在，他们利用先进的数学方法来研究不同寻常物质状态，如超导体、超流体或磁膜等。由于他们的开创性工作，许多人希望未来这种研究将会对材料学和电子学产生革命性影响。\n>>自量子霍尔效应发现以来，许多拓扑相被理论预测和实验验证，然而在实验上直接测量拓扑数仍然是一项挑战. \n', '', '1', '0', '0', '1', '拓扑,物质,相变,研究', '0', '0', '4', '26', '0.00', '1', '2016-12-09 12:11:50', '2016-12-09 11:52:23', null), ('4', 'nX9D', '1', '4', 'C/C++', 'C语言是在70年代初问世的。一九七八年由美国电话电报公司(AT&T)贝尔实验室正式发表了C语言。同时由B.W.Kernighan和D.M.Ritchit合著了著名的“THE C PROGRAMMING LANGUAGE”一书。通常简称为《K&R》，也有人称之为《K&R》标准。但是，在《K&R》中并没有定义一个完整的标准C语言，后来由美国国家标准学会在此基础上制定了一个C 语言标准，于一九八三年发表。通常称之为ANSI C。', '', '1', '0', '0', '1', '语言,标准,美国,发表', '0', '0', '0', '4', '0.00', null, null, '2016-12-09 12:20:46', null);
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
  `img` varchar(255) COLLATE utf8mb4_bin NOT NULL DEFAULT '',
  `birth` datetime DEFAULT NULL,
  `sign` varchar(255) COLLATE utf8mb4_bin DEFAULT '',
  `balance` decimal(10,0) NOT NULL DEFAULT '0',
  `rank` decimal(10,3) NOT NULL DEFAULT '0.000',
  `phone` varchar(255) COLLATE utf8mb4_bin NOT NULL,
  `locked` tinyint(1) NOT NULL DEFAULT '1',
  `create_time` datetime NOT NULL,
  `update_time` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

-- ----------------------------
--  Records of `user`
-- ----------------------------
BEGIN;
INSERT INTO `user` VALUES ('1', 'teddy', '304445056@qq.com', 'teddy', '5d992daa2dad5fe45c893a9a45236d42', 'e91ee9193789b841d7855e55fcf55667', '16f92749ad5e3ab29c63afa167947f65 ', null, '测试sign', '17', '1.000', '17712877316', '0', '2016-11-10 20:14:40', '2016-12-09 12:17:33'), ('2', 'robot', 'robot@silentgo.com', 'robot', '8abb9797d8c1e218e7a8930a56071afd', 'd935ae5b9561da9543dd8fece2220909', '0f6e203dbe07c3abdd02e129a7d187c3', null, null, '11', '1.000', '', '0', '2016-11-28 05:41:43', '2016-12-09 11:54:03');
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
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

-- ----------------------------
--  Records of `user_role`
-- ----------------------------
BEGIN;
INSERT INTO `user_role` VALUES ('1', '1', '2', '3016-11-10 20:14:40', '2016-11-10 20:14:40', null), ('2', '2', '2', '3016-11-28 05:41:43', '2016-11-28 05:41:43', null);
COMMIT;

-- ----------------------------
--  Table structure for `user_social`
-- ----------------------------
DROP TABLE IF EXISTS `user_social`;
CREATE TABLE `user_social` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) NOT NULL,
  `web` varchar(255) COLLATE utf8mb4_bin NOT NULL DEFAULT '',
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
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

-- ----------------------------
--  Records of `user_social`
-- ----------------------------
BEGIN;
INSERT INTO `user_social` VALUES ('1', '1', '', '', '', '', '', '', '', '', '', '', '2016-11-10 20:14:40', null), ('2', '2', '', '', '', '', '', '', '', '', '', '', '2016-11-28 05:41:43', null);
COMMIT;

-- ----------------------------
--  Table structure for `user_tag`
-- ----------------------------
DROP TABLE IF EXISTS `user_tag`;
CREATE TABLE `user_tag` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) NOT NULL,
  `tag_id` bigint(20) NOT NULL,
  `rank` decimal(10,2) NOT NULL DEFAULT '0.00',
  `create_time` datetime NOT NULL,
  `update_time` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
--  Records of `user_tag`
-- ----------------------------
BEGIN;
INSERT INTO `user_tag` VALUES ('1', '1', '1', '1.00', '2016-12-08 10:40:49', null);
COMMIT;

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
CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `vw_comment_detail` AS select `comment`.`is_visible` AS `is_visible`,`comment`.`content` AS `content`,`comment`.`create_time` AS `create_time`,`comment`.`update_time` AS `update_time`,`cmuser`.`nick` AS `nick`,`cmuser`.`id` AS `user_id`,`comment`.`topic_id` AS `topic_id`,`cmuser`.`img` AS `img`,`comment`.`id` AS `id`,`comment`.`down` AS `down`,`comment`.`top` AS `top` from (`comment` left join `user` `cmuser` on((`cmuser`.`id` = `comment`.`user_id`)));

-- ----------------------------
--  View structure for `vw_topic_detail`
-- ----------------------------
DROP VIEW IF EXISTS `vw_topic_detail`;
CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `vw_topic_detail` AS select `topic`.`title` AS `title`,`topic`.`content` AS `content`,`topic`.`texts` AS `texts`,`topic`.`id` AS `id`,`topic`.`url` AS `url`,`topic`.`create_time` AS `create_time`,`topic`.`update_time` AS `update_time`,`author`.`id` AS `author_id`,`author`.`nick` AS `author_nick`,`topic`.`area_id` AS `area_id`,`area`.`abbr` AS `area_abbr`,`author`.`img` AS `author_img`,`topic`.`is_visible` AS `is_visible`,`topic`.`is_close` AS `is_close`,`topic`.`is_delete` AS `is_delete`,`topic`.`is_comment` AS `is_comment`,`topic`.`tags` AS `tags`,`topic`.`top` AS `top`,`topic`.`down` AS `down`,`topic`.`comment_count` AS `comment_count`,`topic`.`view_count` AS `view_count`,`topic`.`rank` AS `topic_rank`,`commentuser`.`id` AS `cuser_id`,`commentuser`.`nick` AS `cuser_nick`,`commentuser`.`img` AS `cuser_img`,`topic`.`last_comment_time` AS `cuser_time`,`author`.`rank` AS `author_rank` from (((`topic` left join `user` `author` on((`author`.`id` = `topic`.`user_id`))) left join `area` on((`area`.`id` = `topic`.`area_id`))) left join `user` `commentuser` on((`commentuser`.`id` = `topic`.`last_comment_user_id`)));

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

-- ----------------------------
--  View structure for `vw_user_tags`
-- ----------------------------
DROP VIEW IF EXISTS `vw_user_tags`;
CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `vw_user_tags` AS select `user_tag`.`user_id` AS `user_id`,`tag`.`tag_name` AS `tag_name`,`user_tag`.`rank` AS `rank` from (`user_tag` left join `tag` on((`user_tag`.`tag_id` = `tag`.`id`)));

SET FOREIGN_KEY_CHECKS = 1;
