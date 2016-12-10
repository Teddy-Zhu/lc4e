package com.silentgo.lc4e.web.event.listener;

import com.silentgo.core.ioc.annotation.Inject;
import com.silentgo.core.plugin.event.EventListener;
import com.silentgo.core.plugin.event.annotation.EventListen;
import com.silentgo.lc4e.database.dao.StatisticDao;
import com.silentgo.lc4e.database.model.Statistic;
import com.silentgo.lc4e.web.event.UserRegisterEvent;

/**
 * Project : lc4e
 * Package : com.silentgo.lc4e.web.event.listener
 *
 * @author <a href="mailto:teddyzhu15@gmail.com" target="_blank">teddyzhu</a>
 *         <p>
 *         Created by teddyzhu on 2016/12/9.
 */
@EventListen(async = true)
public class UserStatisticListener implements EventListener<UserRegisterEvent> {

    @Inject
    StatisticDao statisticDao;

    @Override
    public void onEvent(UserRegisterEvent userRegisterEvent) {

        statisticDao.updateUserSetWhereId(1, 1L);

    }
}
