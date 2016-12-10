package com.silentgo.lc4e.web.event.listener;

import com.silentgo.core.db.intercept.Transaction;
import com.silentgo.core.ioc.annotation.Inject;
import com.silentgo.core.plugin.event.EventListener;
import com.silentgo.core.plugin.event.annotation.EventListen;
import com.silentgo.lc4e.web.event.TopicEvent;
import com.silentgo.lc4e.web.service.TagService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Project : lc4e
 * Package : com.silentgo.lc4e.web.event
 *
 * @author <a href="mailto:teddyzhu15@gmail.com" target="_blank">teddyzhu</a>
 *         <p>
 *         Created by teddyzhu on 2016/11/3.
 */
@EventListen
public class TopicTagInitial implements EventListener<TopicEvent> {

    private static final Logger logger = LoggerFactory.getLogger(TopicTagInitial.class);

    @Inject
    TagService tagService;

    @Override
    @Transaction
    public void onEvent(TopicEvent topicEvent) {

        boolean ret = tagService.addTags(topicEvent.getTopic().getTags().split(","));

        logger.debug("insert tags result :{}", ret);
    }
}
