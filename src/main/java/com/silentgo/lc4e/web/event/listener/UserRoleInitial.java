package com.silentgo.lc4e.web.event.listener;

import com.silentgo.core.db.intercept.Transaction;
import com.silentgo.core.db.propagation.Propagation;
import com.silentgo.core.ioc.annotation.Inject;
import com.silentgo.core.plugin.event.EventListener;
import com.silentgo.core.plugin.event.annotation.EventListen;
import com.silentgo.lc4e.database.dao.RoleDao;
import com.silentgo.lc4e.database.dao.UserRoleDao;
import com.silentgo.lc4e.database.model.Role;
import com.silentgo.lc4e.database.model.UserRole;
import com.silentgo.lc4e.web.event.UserRegisterEvent;
import com.silentgo.lc4e.web.service.ComVarService;
import com.silentgo.utils.Assert;
import com.silentgo.utils.DateKit;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Date;

/**
 * Project : lc4e
 * Package : com.silentgo.lc4e.web.event
 *
 * @author <a href="mailto:teddyzhu15@gmail.com" target="_blank">teddyzhu</a>
 *         <p>
 *         Created by teddyzhu on 2016/11/10.
 */
@EventListen
public class UserRoleInitial implements EventListener<UserRegisterEvent> {

    private static final Logger LOGGER = LoggerFactory.getLogger(UserRoleInitial.class);

    @Inject
    UserRoleDao userRoleDao;

    @Inject
    ComVarService comVarService;

    @Inject
    RoleDao roleDao;

    @Override
    @Transaction
    public void onEvent(UserRegisterEvent event) {

        String abbr = comVarService.getComVarValueByName("RegisterInitialUser");

        Role role = roleDao.queryOneWhereAbbr(abbr);

        Assert.isNotNull(role, "未找到配置角色");

        UserRole userRole = new UserRole();

        userRole.setUserId(event.getUser().getId());
        userRole.setRoleId(role.getId());
        userRole.setCreateTime(new Date());
        userRole.setEndTime(DateKit.addYears(userRole.getCreateTime(), 1000));

        int i = userRoleDao.insertByRow(userRole);

        LOGGER.info("user role initial result :{},user :{} ", i == 1, event.getUser().getId());
    }

}
