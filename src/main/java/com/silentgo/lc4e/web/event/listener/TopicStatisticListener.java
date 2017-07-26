package com.silentgo.lc4e.web.event.listener;

import com.silentgo.core.ioc.annotation.Inject;
import com.silentgo.core.plugin.event.EventListener;
import com.silentgo.core.plugin.event.annotation.EventListen;
import com.silentgo.lc4e.database.dao.SysConfigDao;
import com.silentgo.lc4e.web.event.TopicEvent;

/**
 * Project : lc4e
 * Package : com.silentgo.lc4e.web.event.listener
 *
 * @author <a href="mailto:teddyzhu15@gmail.com" target="_blank">teddyzhu</a>
 *         <p>
 *         Created by teddyzhu on 2016/12/9.
 */
@EventListen(async = true)
public class TopicStatisticListener implements EventListener<TopicEvent> {

    @Inject
    SysConfigDao sysConfigDao;

    @Override
    public void onEvent(TopicEvent topicEvent) {
        sysConfigDao.updateValueSetWhereName(1, "TopicCount");
    }
}
