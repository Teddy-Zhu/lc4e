package com.silentgo.lc4e.web.event.listener;

import com.silentgo.core.plugin.event.EventListener;
import com.silentgo.core.plugin.event.annotation.EventListen;
import com.silentgo.lc4e.web.event.ReplyEvent;

/**
 * Project : lc4e
 * Package : com.silentgo.lc4e.web.event.listener
 *
 * @author <a href="mailto:teddyzhu15@gmail.com" target="_blank">teddyzhu</a>
 *         <p>
 *         Created by teddyzhu on 2016/11/30.
 */
@EventListen
public class ReplyCommentNotice implements EventListener<ReplyEvent> {
    @Override
    public void onEvent(ReplyEvent replyEvent) {

    }
}
