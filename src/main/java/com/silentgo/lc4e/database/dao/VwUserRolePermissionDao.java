package com.silentgo.lc4e.database.dao;

import com.silentgo.core.db.annotation.Query;
import com.silentgo.orm.base.BaseDao;
import com.silentgo.lc4e.database.model.VwUserRolePermission;
import com.silentgo.core.ioc.annotation.Service;

import java.util.Date;
import java.util.List;

@Service
public interface VwUserRolePermissionDao extends BaseDao<VwUserRolePermission> {

    @Query({"RoleIsAvailable", "PermissionIsAvailable", "RoleEndTimeGreater"})
    List<VwUserRolePermission> queryByUserName(Integer roleIsAvailable, Integer permissionIsAvailable, Date time, String username);
}

