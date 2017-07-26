package com.silentgo.lc4e.database.dao;

import com.silentgo.core.ioc.annotation.Service;
import com.silentgo.lc4e.database.model.TopicStatistics;
import com.silentgo.orm.base.BaseDao;
import com.silentgo.orm.sqlparser.annotation.Query;
import com.silentgo.orm.sqlparser.annotation.Set;

import java.util.Date;
import java.util.List;

@Service
public interface TopicStatisticsDao extends BaseDao<TopicStatistics, Long> {

    @Set({"reply_count = reply_count + ?", "update_time =?"})
    int updateReplyCountSetWhereTopicIdAndTime(Integer i, Date updateTime, Long topicId, Date time);

    @Set({"view_count = view_count + ?", "update_time =?"})
    int updateViewCountSetWhereTopicIdAndTime(Integer i, Date updateTime, Long topicId, Date time);

    @Query({"topic_id"})
    List<Long> queryListWhereTimeAndAreaIdOrderByReplyCountDescLimit(Date time, Long areaId, int start, int size);

}

