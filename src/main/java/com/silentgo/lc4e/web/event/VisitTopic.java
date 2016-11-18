package com.silentgo.lc4e.web.event;

import com.silentgo.core.plugin.event.Event;
import com.silentgo.lc4e.database.model.VwTopicDetail;

/**
 * Project : lc4e
 * Package : com.silentgo.lc4e.web.event
 *
 * @author <a href="mailto:teddyzhu15@gmail.com" target="_blank">teddyzhu</a>
 *         <p>
 *         Created by teddyzhu on 2016/11/17.
 */
public class VisitTopic extends Event {

    private VwTopicDetail topicDetail;

    public VisitTopic() {
    }

    public VisitTopic(VwTopicDetail topicDetail) {
        this.topicDetail = topicDetail;
    }

    public VwTopicDetail getTopicDetail() {
        return topicDetail;
    }

    public void setTopicDetail(VwTopicDetail topicDetail) {
        this.topicDetail = topicDetail;
    }
}
