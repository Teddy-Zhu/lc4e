package com.silentgo.lc4e.database.dao;

import com.silentgo.core.ioc.annotation.Service;
import com.silentgo.lc4e.database.model.VwUserTags;
import com.silentgo.orm.base.BaseDao;
import com.silentgo.orm.sqlparser.annotation.Query;

import java.util.List;

@Service
public interface VwUserTagsDao extends BaseDao<VwUserTags, Long> {

    @Query("tagName")
    List<String> queryTagsWhereUserIdOrderByRankDescLimit(Long userId, int start, int size);
}

