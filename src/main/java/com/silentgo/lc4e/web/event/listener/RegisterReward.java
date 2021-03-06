package com.silentgo.lc4e.web.event.listener;

import com.silentgo.core.db.intercept.Transaction;
import com.silentgo.core.db.propagation.Propagation;
import com.silentgo.core.ioc.annotation.Inject;
import com.silentgo.core.plugin.event.EventListener;
import com.silentgo.core.plugin.event.annotation.EventListen;
import com.silentgo.lc4e.database.dao.UserDao;
import com.silentgo.lc4e.web.event.UserRegisterEvent;
import com.silentgo.lc4e.web.service.ConfigService;
import com.silentgo.utils.log.Log;
import com.silentgo.utils.log.LogFactory;

import java.util.Date;

/**
 * Project : lc4e
 * Package : com.silentgo.lc4e.web.event
 *
 * @author <a href="mailto:teddyzhu15@gmail.com" target="_blank">teddyzhu</a>
 *         <p>
 *         Created by teddyzhu on 2016/10/28.
 */
@EventListen(async = true)
public class RegisterReward implements EventListener<UserRegisterEvent> {


    private final Log logger = LogFactory.get(RegisterReward.class);

    @Inject
    private UserDao userDao;

    @Inject
    private ConfigService comVarService;

    @Override
    @Transaction(propagation = Propagation.PROPAGATION_REQUIRES_NEW)
    public void onEvent(UserRegisterEvent event) {

        int i = userDao.updateBalanceSetWhereId(Double.valueOf(comVarService.getComVarValueByName("RegisterReward")),
                new Date(), event.getUser().getId());

        if (i == 1) {
            logger.info("reward user :{} , success ", event.getUser().getName());
        }
        logger.info("exit  RegisterRewardListener ");
    }
}
