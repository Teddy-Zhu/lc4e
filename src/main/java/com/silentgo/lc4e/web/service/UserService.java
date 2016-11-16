package com.silentgo.lc4e.web.service;

import com.silentgo.core.SilentGo;
import com.silentgo.core.cache.annotation.Cache;
import com.silentgo.core.db.intercept.Transaction;
import com.silentgo.core.ioc.annotation.Inject;
import com.silentgo.core.ioc.annotation.Service;
import com.silentgo.core.plugin.event.EventFactory;
import com.silentgo.lc4e.config.Key;
import com.silentgo.lc4e.database.dao.UserDao;
import com.silentgo.lc4e.database.dao.VwUserPermissionDao;
import com.silentgo.lc4e.database.dao.VwUserRolePermissionDao;
import com.silentgo.lc4e.database.model.User;
import com.silentgo.lc4e.database.model.VwUserPermission;
import com.silentgo.lc4e.database.model.VwUserRolePermission;
import com.silentgo.lc4e.entity.UserRolePermission;
import com.silentgo.lc4e.util.shiro.PassDisposer;
import com.silentgo.utils.Assert;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

/**
 * Created by teddy on 2015/8/7.
 */
@Service
public class UserService {


    //    @Inject
//    VwUserRolePermissionDao vwUserRolePermissionDao;
    @Inject
    ComVarService comVarService;

    @Inject
    UserDao userDao;

    @Inject
    VwUserPermissionDao vwUserPermissionDao;

    @Inject
    EventFactory eventFactory;

    @Inject
    VwUserRolePermissionDao vwUserRolePermissionDao;

    @Cache(cacheName = Key.ComVar, index = 0)
    public List<UserRolePermission> findUserRolesAndPermission(String username) {
        List<UserRolePermission> result = new ArrayList<>();
        Date now = new Date();

        List<VwUserPermission> userPermissions = vwUserPermissionDao.queryWhereUserName(username, now, 1);

        List<VwUserRolePermission> userRolePermissions = vwUserRolePermissionDao.queryWhereUserName(username, 1, 1, now);

        userPermissions.forEach(permission -> result.add(new UserRolePermission(permission.getUserName(), null, permission.getPermissionAbbr())));

        userRolePermissions.forEach(userRolePermission -> result.add(new UserRolePermission(userRolePermission.getUserName(), userRolePermission.getRoleAbbr(), userRolePermission.getPermissionAbbr())));

        return result;
    }

    public User findUserFullInfo(String username) {
        return userDao.queryOneWhereName(username);
    }

    // to do simply
    public boolean validateUserName(String name) {
        return userDao.countWhereName(name) > 0;
    }

    public boolean validateUserNick(String nick) {
        return userDao.countWhereNick(nick) > 0;
    }

    public boolean validateUserMail(String mail) {
        return userDao.countWhereMail(mail) > 0;
    }

    @Transaction
    public User createUser(User user) throws Exception {
        Assert.isNotNull(user, "参数错误");
        //validate exist
        //username
        if (validateUserName(user.getName())) {
            throw new Exception("User Name Has been occupied");
        }
        //usernick
        if (validateUserMail(user.getMail())) {
            throw new Exception("Email Has been occupied");
        }
        //usermail
        if (validateUserNick(user.getNick())) {
            throw new Exception("Nick Has been occupied");
        }
        PassDisposer.encryptPassword(user);
        user.setId(null);
        user.setLocked(false);
        user.setCreateTime(new Date());

        BigDecimal initialRank = BigDecimal.valueOf(Long.parseLong(comVarService.getComVarValueByName("UserInitialRank")));
        user.setRank(initialRank);
        user.setBalance(new BigDecimal(0));


        int i = userDao.insertByRow(user);

        Assert.isTrue(i == 1, "数据执行Insert异常 , data :" + SilentGo.me().json().toJsonString(user));

        return user;
    }
}
