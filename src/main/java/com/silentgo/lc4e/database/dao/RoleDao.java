package com.silentgo.lc4e.database.dao;

import com.silentgo.orm.base.BaseDao;
import com.silentgo.lc4e.database.model.Role;
import com.silentgo.core.ioc.annotation.Service;

@Service
public interface RoleDao extends BaseDao<Role, Long> {

    Role queryOneWhereAbbr(String abbr);
}

