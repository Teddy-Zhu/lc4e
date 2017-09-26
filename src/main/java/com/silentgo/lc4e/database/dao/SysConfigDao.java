package com.silentgo.lc4e.database.dao;

import com.silentgo.core.ioc.annotation.Service;
import com.silentgo.lc4e.database.model.SysConfig;
import com.silentgo.orm.base.BaseDao;
import com.silentgo.orm.base.annotation.Param;
import com.silentgo.orm.sqlparser.annotation.Set;

import java.util.Collection;
import java.util.List;

@Service
public interface  SysConfigDao extends BaseDao<SysConfig, Long> {


    SysConfig queryOneWhereName(String name);

    List<SysConfig> queryListWhereName(Collection<String> names);

    @Set("value = value + <#i/>")
    int updateValueSetWhereName(@Param("i") Integer i, String name);


    @Set({"group_name = <#groupName/>"})
    int updateConfigGroupSetWhereGroupId(@Param("groupName") String groupName, Long groupId);

}

