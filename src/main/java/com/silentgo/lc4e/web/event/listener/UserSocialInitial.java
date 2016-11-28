package com.silentgo.lc4e.web.event.listener;

import com.silentgo.core.db.intercept.Transaction;
import com.silentgo.core.db.propagation.Propagation;
import com.silentgo.core.ioc.annotation.Inject;
import com.silentgo.core.plugin.event.EventListener;
import com.silentgo.core.plugin.event.annotation.EventListen;
import com.silentgo.lc4e.database.dao.UserSocialDao;
import com.silentgo.lc4e.database.model.UserSocial;
import com.silentgo.lc4e.web.event.UserRegisterEvent;
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
public class UserSocialInitial implements EventListener<UserRegisterEvent> {

    private static final Logger LOGGER = LoggerFactory.getLogger(UserSocialInitial.class);

    @Inject
    UserSocialDao userSocialDao;

    @Override
    @Transaction
    public void onEvent(UserRegisterEvent event) {

        UserSocial userSocial = new UserSocial();

        userSocial.setUserId(event.getUser().getId());
        userSocial.setCreateTime(new Date());

        int i = userSocialDao.insertByRow(userSocial);

        LOGGER.info("initial user social , result : {} ,userId:{}", i == 1, event.getUser().getId());
    }
}
