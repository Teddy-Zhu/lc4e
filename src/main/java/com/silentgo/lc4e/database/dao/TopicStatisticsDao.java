package com.silentgo.lc4e.database.dao;

import com.silentgo.core.ioc.annotation.Service;
import com.silentgo.lc4e.database.model.TopicStatistics;
import com.silentgo.orm.base.BaseDao;
import com.silentgo.orm.base.Pager;
import com.silentgo.orm.base.annotation.Param;
import com.silentgo.orm.sqlparser.annotation.Query;
import com.silentgo.orm.sqlparser.annotation.Set;

import java.util.Date;
import java.util.List;

@Service
public interface TopicStatisticsDao extends BaseDao<TopicStatistics, Long> {

    @Set({"reply_count = reply_count + <#i/>", "update_time =<#updateTime/>"})
    int updateReplyCountSetWhereTopicIdAndTime(@Param("i") Integer i, @Param("updateTime") Date updateTime, Long topicId, Date time);

    @Set({"view_count = view_count + <#i/>", "update_time =<#updateTime/>"})
    int updateViewCountSetWhereTopicIdAndTime(@Param("i") Integer i, @Param("updateTime") Date updateTime, Long topicId, Date time);

    @Query({"topic_id"})
    List<Long> queryListWhereTimeAndAreaIdOrderByReplyCountDescLimit(Date time, Long areaId, Pager pager);

}

