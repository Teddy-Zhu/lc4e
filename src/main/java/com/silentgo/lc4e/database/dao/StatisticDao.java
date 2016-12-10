package com.silentgo.lc4e.database.dao;

import com.silentgo.lc4e.database.model.Statistic;
import com.silentgo.orm.base.BaseDao;
import com.silentgo.core.ioc.annotation.Service;
import com.silentgo.orm.sqlparser.annotation.Set;

@Service
public interface StatisticDao extends BaseDao<Statistic> {


    @Set("topic_count = topic_count + ?")
    int updateTopicSetWhereId(Integer i, Long id);

    @Set("user_count = user_count + ?")
    int updateUserSetWhereId(Integer i, Long id);

}

