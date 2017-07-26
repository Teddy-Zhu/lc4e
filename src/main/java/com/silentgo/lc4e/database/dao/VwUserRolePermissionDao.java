package com.silentgo.lc4e.database.dao;

import com.silentgo.core.ioc.annotation.Service;
import com.silentgo.lc4e.database.model.VwUserRolePermission;
import com.silentgo.orm.base.BaseDao;
import com.silentgo.orm.sqlparser.annotation.Where;

import java.util.Date;
import java.util.List;

@Service
public interface VwUserRolePermissionDao extends BaseDao<VwUserRolePermission, Long> {

    @Where({" role_is_available = ? ", " permission_is_available = ? ", " role_end_time >= ? "})
    List<VwUserRolePermission> queryWhereUserName(String username, Integer roleIsAvailable, Integer permissionIsAvailable, Date time);
}

