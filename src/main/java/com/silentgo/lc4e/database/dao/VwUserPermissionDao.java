package com.silentgo.lc4e.database.dao;

import com.silentgo.core.db.annotation.Query;
import com.silentgo.core.db.funcanalyse.DaoKeyWord;
import com.silentgo.orm.base.BaseDao;
import com.silentgo.lc4e.database.model.VwUserPermission;
import com.silentgo.core.ioc.annotation.Service;

import java.util.Date;
import java.util.List;

@Service
public interface VwUserPermissionDao extends BaseDao<VwUserPermission> {

    @Query({"PermissionEndTimeGreater", "PermissionIsAvailable"})
    List<VwUserPermission> queryByUserName(Date date, int isAvailable, String username);
}

