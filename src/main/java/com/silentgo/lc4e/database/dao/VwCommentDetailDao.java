package com.silentgo.lc4e.database.dao;

import com.silentgo.core.ioc.annotation.Service;
import com.silentgo.lc4e.database.model.VwCommentDetail;
import com.silentgo.orm.base.BaseDao;
import com.silentgo.orm.base.Pager;
import com.silentgo.orm.sqlparser.annotation.ColumnIgnore;

import java.util.List;

@Service
public interface VwCommentDetailDao extends BaseDao<VwCommentDetail, Long> {


    @ColumnIgnore("isVisible")
    List<VwCommentDetail> queryWhereTopicIdAndisVisibleLimit(Long id, Boolean isVisible, Pager pager);
}

