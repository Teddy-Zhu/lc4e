package com.silentgo.lc4e.web.event;

import com.silentgo.core.ioc.annotation.Inject;
import com.silentgo.core.plugin.event.EventListener;
import com.silentgo.core.plugin.event.annotation.EventListen;
import com.silentgo.lc4e.database.dao.UserDao;
import com.silentgo.lc4e.database.model.User;
import com.silentgo.lc4e.web.service.ComVarService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Project : lc4e
 * Package : com.silentgo.lc4e.web.event
 *
 * @author <a href="mailto:teddyzhu15@gmail.com" target="_blank">teddyzhu</a>
 *         <p>
 *         Created by teddyzhu on 2016/10/28.
 */
@EventListen(async = true)
public class RegisterRewardListener implements EventListener<UserRegisterEvent> {


    private final Logger logger = LoggerFactory.getLogger(RegisterRewardListener.class);

    @Inject
    private UserDao userDao;

    @Inject
    private ComVarService comVarService;

    @Override
    public void onEvent(UserRegisterEvent event) {

        int i = userDao.updateSetWhereId(Integer.parseInt(comVarService.getComVarValueByName("RegisterReward")), event.getUser().getId());

        if (i == 1) {
            logger.info("reward user :{} , success ", event.getUser().getName());
        }
        logger.info("exit  RegisterRewardListener ");
    }
}
