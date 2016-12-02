package com.silentgo.lc4e.database.dao;

import com.silentgo.core.ioc.annotation.Service;
import com.silentgo.lc4e.database.model.Comment;
import com.silentgo.orm.base.BaseDao;
import com.silentgo.orm.sqlparser.annotation.ColumnIgnore;

import java.util.List;

@Service
public interface CommentDao extends BaseDao<Comment> {

    int countWhereTopicIdAndisVisible(Long id, Boolean isVisible);

}
