package com.silentgo.lc4e.database.dao;

import com.silentgo.orm.base.BaseDao;
import com.silentgo.lc4e.database.model.TopicRank;
import com.silentgo.core.ioc.annotation.Service;
import com.silentgo.orm.sqlparser.annotation.Set;

@Service
public interface TopicRankDao extends BaseDao<TopicRank> {


    @Set(" view_count = view_count + ?")
    int updateSetWhereTopicId(Integer count, Long id);

    @Set(" comment_count = comment_count + ? ")
    int updateReplyCountSetWhereTopicId(Integer count, Long id);
}

