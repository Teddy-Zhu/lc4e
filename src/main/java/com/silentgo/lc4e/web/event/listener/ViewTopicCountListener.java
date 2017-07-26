package com.silentgo.lc4e.web.event.listener;

import com.silentgo.core.db.intercept.Transaction;
import com.silentgo.core.db.propagation.Propagation;
import com.silentgo.core.ioc.annotation.Inject;
import com.silentgo.core.plugin.event.EventListener;
import com.silentgo.core.plugin.event.annotation.EventListen;
import com.silentgo.lc4e.database.dao.TopicDao;
import com.silentgo.lc4e.database.dao.TopicStatisticsDao;
import com.silentgo.lc4e.database.model.TopicStatistics;
import com.silentgo.lc4e.web.event.VisitTopic;
import com.silentgo.utils.DateKit;
import com.silentgo.utils.log.Log;
import com.silentgo.utils.log.LogFactory;

import java.util.Date;

/**
 * Project : lc4e
 * Package : com.silentgo.lc4e.web.event
 *
 * @author <a href="mailto:teddyzhu15@gmail.com" target="_blank">teddyzhu</a>
 *         <p>
 *         Created by teddyzhu on 2016/11/17.
 */
@EventListen(async = true)
public class ViewTopicCountListener implements EventListener<VisitTopic> {
    private static final Log LOGGER = LogFactory.get(UserSocialInitial.class);

    @Inject
    TopicDao topicDao;

    @Inject
    TopicStatisticsDao topicStatisticsDao;

    @Override
    @Transaction(propagation = Propagation.PROPAGATION_NOT_SUPPORTED)
    public void onEvent(VisitTopic visitTopic) {

        LOGGER.debug("view topic");

        int i = topicDao.updateSetWhereId(1, visitTopic.getTopicDetail().getId());


        int ret = topicStatisticsDao.updateViewCountSetWhereTopicIdAndTime(1, new Date(), visitTopic.getTopicDetail().getId(), DateKit.removeTime(new Date()));

        if (ret != 1) {
            TopicStatistics topicStatistics = new TopicStatistics();
            topicStatistics.setTime(DateKit.removeTime(new Date()));
            topicStatistics.setReplyCount(0L);
            topicStatistics.setTopicId(visitTopic.getTopicDetail().getId());
            topicStatistics.setCreateTime(new Date());
            topicStatistics.setViewCount(1L);
            ret = topicStatisticsDao.insertByRow(topicStatistics);
        }
        LOGGER.debug("exit topic view count ,result :{} , save topic statistic view count result : {}", i == 1, ret == 1);
    }
}
