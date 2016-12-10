package com.silentgo.lc4e.web.event.listener;

import com.silentgo.core.ioc.annotation.Inject;
import com.silentgo.core.plugin.event.EventListener;
import com.silentgo.core.plugin.event.annotation.EventListen;
import com.silentgo.lc4e.database.dao.UserDao;
import com.silentgo.lc4e.web.event.ReplyEvent;
import com.silentgo.lc4e.web.service.ComVarService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Date;

/**
 * Project : lc4e
 * Package : com.silentgo.lc4e.web.event.listener
 *
 * @author <a href="mailto:teddyzhu15@gmail.com" target="_blank">teddyzhu</a>
 *         <p>
 *         Created by teddyzhu on 2016/12/9.
 */
@EventListen
public class ReplyReward implements EventListener<ReplyEvent> {

    private static final Logger LOGGER = LoggerFactory.getLogger(ReplyReward.class);

    @Inject
    private UserDao userDao;

    @Inject
    private ComVarService comVarService;

    @Override
    public void onEvent(ReplyEvent replyEvent) {

        Double value = Double.valueOf(comVarService.getComVarValueByName("ReplyReward"));
        int i = userDao.updateBalanceSetWhereId(value, new Date(), replyEvent.getComment().getUserId());
        LOGGER.debug("reply reward result :{}", i == 1);
    }
}
