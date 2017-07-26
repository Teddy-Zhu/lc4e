package com.silentgo.lc4e.database.dao;

import com.silentgo.orm.base.BaseDao;
import com.silentgo.lc4e.database.model.UserTag;
import com.silentgo.core.ioc.annotation.Service;
import com.silentgo.orm.model.Page;
import com.silentgo.orm.sqlparser.annotation.Query;

import java.util.List;

@Service
public interface UserTagDao extends BaseDao<UserTag, Long> {

}

