package com.silentgo.lc4e.database.dao;

import com.silentgo.core.ioc.annotation.Service;
import com.silentgo.lc4e.database.model.Area;
import com.silentgo.orm.base.BaseDao;
import com.silentgo.orm.base.annotation.Param;
import com.silentgo.orm.sqlparser.annotation.ColumnIgnore;
import com.silentgo.orm.sqlparser.annotation.Where;

import java.util.List;

@Service
public interface AreaDao extends BaseDao<Area, Long> {

    @Where({" area.is_publish =<#isPublish/> ",
            " area.is_visible =<#isVisible/> ",
            " area.is_close =<#isClose/> "})
    int countWhereId(Long id, @Param("isPublish") boolean isPublish,
                     @Param("isVisible") boolean isVisible,
                     @Param("isClose") boolean isClose);

    @ColumnIgnore({"parent_id", "description", "css", "icon", "is_publish", "is_visible", "is_close"
            , "create_time", "update_time"})
    List<Area> queryListWhereIsPublishAndIsVisibleAndIsClose(
            boolean isPublish,
            boolean isVisible,
            boolean isClose);
}

