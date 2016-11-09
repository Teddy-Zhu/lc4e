package com.silentgo.lc4e.database.dao;

import com.silentgo.orm.base.BaseDao;
import com.silentgo.lc4e.database.model.SysConfig;
import com.silentgo.core.ioc.annotation.Service;

import java.util.Collection;
import java.util.List;

@Service
public interface SysConfigDao extends BaseDao<SysConfig> {


    SysConfig queryOneWhereName(String name);

    List<SysConfig> queryListWhereName(Collection<String> names);

}

