package com.silentgo.lc4e.web.event.listener;

import com.silentgo.core.ioc.annotation.Inject;
import com.silentgo.core.plugin.event.EventListener;
import com.silentgo.core.plugin.event.annotation.EventListen;
import com.silentgo.lc4e.database.dao.TopicDao;
import com.silentgo.lc4e.database.dao.TopicStatisticsDao;
import com.silentgo.lc4e.database.model.TopicStatistics;
import com.silentgo.lc4e.web.event.ReplyEvent;
import com.silentgo.utils.DateKit;
import com.silentgo.utils.log.Log;
import com.silentgo.utils.log.LogFactory;

import java.util.Date;

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

    private static final Log LOGGER = LogFactory.get(ReplyCount.class);
    @Inject
    TopicDao topicDao;
    @Inject
    TopicStatisticsDao topicStatisticsDao;

    @Override
    public void onEvent(ReplyEvent replyEvent) {
        int i = topicDao.updateReplyCountSetWhereId(1,
                replyEvent.getComment().getUserId(),
                replyEvent.getComment().getCreateTime(),
                replyEvent.getComment().getTopicId());


        int ret = topicStatisticsDao.updateReplyCountSetWhereTopicIdAndTime(1, new Date(), replyEvent.getComment().getTopicId(), DateKit.removeTime(replyEvent.getComment().getCreateTime()));

        if (ret != 1) {
            TopicStatistics topicStatistics = new TopicStatistics();
            topicStatistics.setTime(DateKit.removeTime(replyEvent.getComment().getCreateTime()));
            topicStatistics.setReplyCount(1L);
            topicStatistics.setTopicId(replyEvent.getComment().getTopicId());
            topicStatistics.setCreateTime(new Date());
            topicStatistics.setViewCount(0L);
            ret = topicStatisticsDao.insertByRow(topicStatistics);
        }
        LOGGER.debug("increase comment count result : {} , save statistics result :{}", i == 1, ret == 1);
    }
}
