package com.silentgo.lc4e.web.event;

import com.silentgo.core.plugin.event.Event;
import com.silentgo.lc4e.database.model.User;

/**
 * Project : lc4e
 * Package : com.silentgo.lc4e.web.event
 *
 * @author <a href="mailto:teddyzhu15@gmail.com" target="_blank">teddyzhu</a>
 *         <p>
 *         Created by teddyzhu on 2016/10/28.
 */
public class UserRegisterEvent extends Event {

    private User user;

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public UserRegisterEvent(User user) {
        this.user = user;
    }
}
