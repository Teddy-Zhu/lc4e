package com.silentgo.lc4e.database.dao;

import com.silentgo.orm.base.BaseDao;
import com.silentgo.lc4e.database.model.Topic;
import com.silentgo.core.ioc.annotation.Service;
import com.silentgo.orm.sqlparser.annotation.Set;

import java.util.Date;

@Service
public interface TopicDao extends BaseDao<Topic> {

    @Set("view_count = view_count + ?")
    int updateSetWhereId(Integer i, Long topicId);

    @Set({"comment_count = comment_count + ?", "last_comment_user_id=?", "last_comment_time=?"})
    int updateReplyCountSetWhereId(Integer i, Long lastCommentUserId, Date lastCommentTime, Long topicId);

    int countWhereId(Long id);
}

