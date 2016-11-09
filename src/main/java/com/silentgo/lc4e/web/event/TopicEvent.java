package com.silentgo.lc4e.web.event;

import com.silentgo.core.plugin.event.Event;
import com.silentgo.lc4e.database.model.Topic;

/**
 * Project : lc4e
 * Package : com.silentgo.lc4e.web.event
 *
 * @author <a href="mailto:teddyzhu15@gmail.com" target="_blank">teddyzhu</a>
 *         <p>
 *         Created by teddyzhu on 2016/11/3.
 */
public class TopicEvent extends Event {

    private Topic topic;

    public TopicEvent(Topic topic) {
        this.topic = topic;
    }

    public Topic getTopic() {
        return topic;
    }

    public void setTopic(Topic topic) {
        this.topic = topic;
    }
}
