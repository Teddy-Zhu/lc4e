package com.silentgo.lc4e.database.dao;

import com.silentgo.core.ioc.annotation.Service;
import com.silentgo.lc4e.database.model.Topic;
import com.silentgo.lc4e.web.service.model.SimpleTopicInfo;
import com.silentgo.orm.base.BaseDao;
import com.silentgo.orm.base.annotation.Param;
import com.silentgo.orm.sqlparser.annotation.LeftJoin;
import com.silentgo.orm.sqlparser.annotation.Query;
import com.silentgo.orm.sqlparser.annotation.Set;
import com.silentgo.orm.sqlparser.annotation.Where;

import java.util.Date;
import java.util.List;

@Service
public interface TopicDao extends BaseDao<Topic, Long> {

    @Set("view_count = view_count + <#i/>")
    int updateSetWhereId(@Param("i") Integer i, Long topicId);

    @Set({"comment_count = comment_count + <#i/>", "last_comment_user_id=<#lastUser/>", "last_comment_time=<#lastTime/>"})
    int updateReplyCountSetWhereId(@Param("i") Integer i,@Param("lastUser") Long lastCommentUserId,@Param("lastTime") Date lastCommentTime, Long topicId);

    int countWhereId(Long id);

    @LeftJoin(value = "area", on = "area.id = topic.area_id")
    @Query(value = {"topic.id", "url", "abbr", "name", "title"})
    @Where("topic.id in (<#ids/>)")
    List<SimpleTopicInfo> queryListWhere(@Param("ids") long[] ids);

}

