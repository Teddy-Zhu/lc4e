package com.silentgo.lc4e.web.response;

import com.silentgo.lc4e.database.model.VwTopicDetail;

import java.math.BigDecimal;

/**
 * Project : lc4e
 * Package : com.silentgo.lc4e.web.response
 *
 * @author <a href="mailto:teddyzhu15@gmail.com" target="_blank">teddyzhu</a>
 *         <p>
 *         Created by teddyzhu on 2017/7/10.
 */
public class TopicRes extends VwTopicDetail {

    @Override
    public BigDecimal getTopicRank() {
        return null;
    }
}
