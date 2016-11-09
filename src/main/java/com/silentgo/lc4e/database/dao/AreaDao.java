package com.silentgo.lc4e.database.dao;

import com.silentgo.orm.base.BaseDao;
import com.silentgo.lc4e.database.model.Area;
import com.silentgo.core.ioc.annotation.Service;
import com.silentgo.orm.sqlparser.annotation.Where;

@Service
public interface AreaDao extends BaseDao<Area> {

    @Where({" area.is_publish = ? " , " area.is_visible = ? " , " area.is_close = ? "})
    int countWhereId(Long id, boolean isPublish, boolean isVisible, boolean isClose);

}

