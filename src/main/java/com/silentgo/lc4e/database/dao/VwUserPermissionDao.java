package com.silentgo.lc4e.database.dao;

import com.silentgo.core.ioc.annotation.Service;
import com.silentgo.lc4e.database.model.VwUserPermission;
import com.silentgo.orm.base.BaseDao;
import com.silentgo.orm.sqlparser.annotation.Where;

import java.util.Date;
import java.util.List;

@Service
public interface VwUserPermissionDao extends BaseDao<VwUserPermission, Long> {

    @Where({"permission_end_time >= ? ", " permission_is_available = ? "})
    List<VwUserPermission> queryWhereUserName(String username, Date date, int isAvailable);
}

