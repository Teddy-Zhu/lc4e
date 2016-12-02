package com.silentgo.lc4e.web.event.listener;

import com.silentgo.core.ioc.annotation.Inject;
import com.silentgo.core.plugin.event.EventListener;
import com.silentgo.core.plugin.event.annotation.EventListen;
import com.silentgo.lc4e.database.dao.TopicRankDao;
import com.silentgo.lc4e.web.event.ReplyEvent;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Project : lc4e
 * Package : com.silentgo.lc4e.web.event.listener
 *
 * @author <a href="mailto:teddyzhu15@gmail.com" target="_blank">teddyzhu</a>
 *         <p>
 *         Created by teddyzhu on 2016/11/30.
 */
@EventListen
public class ReplyCount implements EventListener<ReplyEvent> {

    private static final Logger LOGGER = LoggerFactory.getLogger(ReplyCount.class);
    @Inject
    TopicRankDao topicRankDao;

    @Override
    public void onEvent(ReplyEvent replyEvent) {
        int i = topicRankDao.updateReplyCountSetWhereTopicId(1, replyEvent.getComment().getTopicId());

        LOGGER.debug("increase comment count result : {}", i == 1);
    }
}
