package com.silentgo.lc4e.database.dao;

import com.silentgo.core.ioc.annotation.Service;
import com.silentgo.lc4e.database.model.User;
import com.silentgo.orm.base.BaseDao;
import com.silentgo.orm.base.annotation.Param;
import com.silentgo.orm.sqlparser.annotation.ColumnIgnore;
import com.silentgo.orm.sqlparser.annotation.Set;

import java.math.BigDecimal;
import java.util.Date;

@Service
public interface UserDao extends BaseDao<User, Long> {

    User queryOneWhereName(String name);

    @ColumnIgnore({"password", "passsalt", "rank", "locked"})
    User queryOneWhereId(Long id);

    int countWhereName(String name);

    int countWhereNick(String nick);

    int countWhereMail(String mail);

    @Set({" balance = balance + <#balance/> ", " update_time = <#updateTime/>"})
    int updateBalanceSetWhereId(@Param("balance") Double balance, @Param("updateTime") Date updateTime, Long id);

}

