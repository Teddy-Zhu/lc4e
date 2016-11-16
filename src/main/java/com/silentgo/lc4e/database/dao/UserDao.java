package com.silentgo.lc4e.database.dao;

import com.silentgo.core.ioc.annotation.Service;
import com.silentgo.lc4e.database.model.User;
import com.silentgo.orm.base.BaseDao;
import com.silentgo.orm.sqlparser.annotation.Set;

import java.util.Date;

@Service
public interface UserDao extends BaseDao<User> {

    User queryOneWhereName(String name);

    int countWhereName(String name);

    int countWhereNick(String nick);

    int countWhereMail(String mail);

    @Set({" balance = balance + ? ", " update_time = ?"})
    int updateSetWhereId(int balance, Date updateTime, Long id);

}

