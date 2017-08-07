package com.silentgo.lc4e.database.dao;

import com.silentgo.core.ioc.annotation.Service;
import com.silentgo.lc4e.database.model.VwUserRolePermission;
import com.silentgo.orm.base.BaseDao;
import com.silentgo.orm.base.annotation.Param;
import com.silentgo.orm.sqlparser.annotation.Where;

import java.util.Date;
import java.util.List;

@Service
public interface VwUserRolePermissionDao extends BaseDao<VwUserRolePermission, Long> {

    @Where({" role_is_available = <#roleIsAvailable/> ", " permission_is_available = <#permissionIsAvailable/> ", " role_end_time >= <#time/> "})
    List<VwUserRolePermission> queryWhereUserName(String username, @Param("roleIsAvailable") Integer roleIsAvailable,@Param("permissionIsAvailable") Integer permissionIsAvailable,@Param("time") Date time);
}

