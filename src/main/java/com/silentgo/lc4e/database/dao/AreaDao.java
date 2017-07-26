package com.silentgo.lc4e.database.dao;

import com.silentgo.core.ioc.annotation.Service;
import com.silentgo.lc4e.database.model.Area;
import com.silentgo.orm.base.BaseDao;
import com.silentgo.orm.sqlparser.annotation.ColumnIgnore;
import com.silentgo.orm.sqlparser.annotation.Where;

import java.util.List;

@Service
public interface AreaDao extends BaseDao<Area, Long> {

    @Where({" area.is_publish = ? ", " area.is_visible = ? ", " area.is_close = ? "})
    int countWhereId(Long id, boolean isPublish, boolean isVisible, boolean isClose);

    @ColumnIgnore({"parent_id", "description", "css", "icon", "is_publish", "is_visible", "is_close"
            , "create_time", "update_time"})
    List<Area> queryListWhereIsPublishAndIsVisibleAndIsClose(boolean isPublish, boolean isVisible, boolean isClose);
}

