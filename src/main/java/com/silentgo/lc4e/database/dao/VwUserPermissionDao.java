package com.silentgo.lc4e.database.dao;

import com.silentgo.core.ioc.annotation.Service;
import com.silentgo.lc4e.database.model.VwUserPermission;
import com.silentgo.orm.base.BaseDao;
import com.silentgo.orm.base.annotation.Param;
import com.silentgo.orm.sqlparser.annotation.Where;

import java.util.Date;
import java.util.List;

@Service
public interface VwUserPermissionDao extends BaseDao<VwUserPermission, Long> {

    @Where({"permission_end_time >= <#date/> ", " permission_is_available = <#isAvailable/> "})
    List<VwUserPermission> queryWhereUserName(String username, @Param("date") Date date,@Param("isAvailable") int isAvailable);
}

