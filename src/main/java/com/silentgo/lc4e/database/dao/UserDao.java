package com.silentgo.lc4e.database.dao;

import com.silentgo.orm.base.BaseDao;
import com.silentgo.lc4e.database.model.User;
import com.silentgo.core.ioc.annotation.Service;

@Service
public interface UserDao extends BaseDao<User> {

    User queryOneByName(String name);

    int countByName(String name);

    int countByNick(String nick);

    int countByMail(String mail);
}

