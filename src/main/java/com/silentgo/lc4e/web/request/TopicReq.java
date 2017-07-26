package com.silentgo.lc4e.web.request;

import com.silentgo.lc4e.database.model.Topic;

/**
 * Project : lc4e
 * Package : com.silentgo.lc4e.web.request
 *
 * @author <a href="mailto:teddyzhu15@gmail.com" target="_blank">teddyzhu</a>
 *         <p>
 *         Created by teddyzhu on 2017/7/10.
 */
public class TopicReq extends Topic {

    private String captcha;

    public String getCaptcha() {
        return captcha;
    }

    public void setCaptcha(String captcha) {
        this.captcha = captcha;
    }
}
