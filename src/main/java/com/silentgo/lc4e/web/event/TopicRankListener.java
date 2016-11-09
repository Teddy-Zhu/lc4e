package com.silentgo.lc4e.web.event;

import com.hankcs.hanlp.HanLP;
import com.silentgo.core.ioc.annotation.Inject;
import com.silentgo.core.plugin.event.EventListener;
import com.silentgo.core.plugin.event.annotation.EventListen;
import com.silentgo.lc4e.database.dao.TopicRankDao;
import com.silentgo.lc4e.database.model.TopicRank;
import com.silentgo.utils.StringKit;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

/**
 * Project : lc4e
 * Package : com.silentgo.lc4e.web.event
 *
 * @author <a href="mailto:teddyzhu15@gmail.com" target="_blank">teddyzhu</a>
 *         <p>
 *         Created by teddyzhu on 2016/11/3.
 */
@EventListen
public class TopicRankListener implements EventListener<TopicEvent> {

    private static final Logger logger = LoggerFactory.getLogger(TopicRankListener.class);
    @Inject
    TopicRankDao topicRankDao;

    @Override
    public void onEvent(TopicEvent topicEvent) {
        List<String> tags = HanLP.extractKeyword(topicEvent.getTopic().getTitle() + topicEvent.getTopic().getContent(), 4);

        TopicRank topicRank = new TopicRank();
        topicRank.setCreateTime(new Date());
        topicRank.setTopicId(topicEvent.getTopic().getId());
        topicRank.setTags(StringKit.join(tags, ","));
        topicRank.setCommentCount(0);
        topicRank.setViewCount(0);
        topicRank.setRank(new BigDecimal(0));

        int i = topicRankDao.insertByRow(topicRank);

        logger.info("insert topic rank result :{}", i == 1);

    }
}
