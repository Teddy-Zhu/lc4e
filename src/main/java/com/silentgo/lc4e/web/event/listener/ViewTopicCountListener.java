package com.silentgo.lc4e.web.event.listener;

import com.silentgo.core.ioc.annotation.Inject;
import com.silentgo.core.plugin.event.EventListener;
import com.silentgo.core.plugin.event.annotation.EventListen;
import com.silentgo.lc4e.database.dao.TopicRankDao;
import com.silentgo.lc4e.database.model.TopicRank;
import com.silentgo.lc4e.web.event.VisitTopic;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Project : lc4e
 * Package : com.silentgo.lc4e.web.event
 *
 * @author <a href="mailto:teddyzhu15@gmail.com" target="_blank">teddyzhu</a>
 *         <p>
 *         Created by teddyzhu on 2016/11/17.
 */
@EventListen(async = true)
public class ViewTopicCountListener implements EventListener<VisitTopic> {
    private static final Logger LOGGER = LoggerFactory.getLogger(UserSocialInitial.class);

    @Inject
    TopicRankDao topicRankDao;

    @Override
    public void onEvent(VisitTopic visitTopic) {

        LOGGER.debug("view topic");

        int i = topicRankDao.updateSetWhereTopicId(1, visitTopic.getTopicDetail().getId());

        LOGGER.debug("exit topic view count ,ret :{}", i == 1);
    }
}