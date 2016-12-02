package com.silentgo.lc4e.web.event;

import com.silentgo.core.plugin.event.Event;
import com.silentgo.lc4e.database.model.Comment;

/**
 * Project : lc4e
 * Package : com.silentgo.lc4e.web.event.listener
 *
 * @author <a href="mailto:teddyzhu15@gmail.com" target="_blank">teddyzhu</a>
 *         <p>
 *         Created by teddyzhu on 2016/11/30.
 */
public class ReplyEvent extends Event{
    private Comment comment;

    public ReplyEvent(Comment comment) {
        this.comment = comment;
    }

    public Comment getComment() {
        return comment;
    }

    public void setComment(Comment comment) {
        this.comment = comment;
    }
}
