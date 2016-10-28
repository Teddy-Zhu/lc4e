package com.silentgo.lc4e.database.dao;

import com.silentgo.lc4e.entity.MenuEntity;
import com.silentgo.orm.base.BaseDao;
import com.silentgo.lc4e.database.model.Menu;
import com.silentgo.core.ioc.annotation.Service;

import java.util.List;

@Service
public interface MenuDao extends BaseDao<Menu> {

    List<MenuEntity> queryListOrderByParentIdAndOrder();
}

