package com.silentgo.lc4e.web.service;

import com.hankcs.hanlp.HanLP;
import com.silentgo.core.cache.CacheManager;
import com.silentgo.core.config.SilentGoConfig;
import com.silentgo.core.ioc.annotation.Inject;
import com.silentgo.core.ioc.annotation.Service;
import com.silentgo.core.plugin.event.EventFactory;
import com.silentgo.lc4e.config.Key;
import com.silentgo.lc4e.database.dao.AreaDao;
import com.silentgo.lc4e.database.dao.TopicDao;
import com.silentgo.lc4e.database.dao.VwTopicDetailDao;
import com.silentgo.lc4e.database.model.Topic;
import com.silentgo.lc4e.database.model.TopicRank;
import com.silentgo.lc4e.database.model.VwTopicDetail;
import com.silentgo.lc4e.entity.Article;
import com.silentgo.lc4e.entity.Popup;
import com.silentgo.lc4e.tool.RelativeDate;
import com.silentgo.lc4e.util.exception.AppBusinessException;
import com.silentgo.lc4e.web.event.TopicEvent;
import com.silentgo.orm.base.TableModel;
import com.silentgo.orm.model.Page;
import com.silentgo.utils.Assert;
import com.silentgo.utils.CollectionKit;
import com.silentgo.utils.DateKit;
import com.silentgo.utils.StringKit;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Random;

/**
 * Created by teddy on 2015/9/23.
 */
@Service
public class TopicService {


    @Inject
    CurUserService curUserService;
    @Inject
    VwTopicDetailDao vwTopicDetailDao;

    @Inject
    PageFilter pageFilter;

    @Inject
    AreaDao areaDao;

    /**
     * all topic in time range(3 month)
     *
     * @param order 1:  by user favorite tag
     *              2: by topic publish time
     *              3: by last reply time
     * @return
     */
    public Page<Article> getTopicByLast(int order, int page, int size) {

        return null;
    }

    public Page<VwTopicDetail> getTopicByPubDate(int page, int size) {


        Date date = DateKit.addMonths(new Date(), 3);

        int total = vwTopicDetailDao.countWhere(date);

        Page<VwTopicDetail> result = buildDetailModel(page, size, total);

        List<VwTopicDetail> list = vwTopicDetailDao.queryWhereOrderByCreateTimeDescLimit(date, result.getStart(), result.getPageSize());

        result.setResult(list);

        return result;
    }

    public Page<VwTopicDetail> buildDetailModel(int page, int size, int total) {

        Page<VwTopicDetail> result = new Page<>();
        result.setPageNumber(page);
        result.setPageSize(size);
        pageFilter.filterPage(result);
        result.setTotalCount(total);
        return result;
    }


    public Page<Article> getArticle(int page, int order, String area) {
        Integer size = 10;
        if (StringKit.isBlank(area) || "all".equals(area)) {
            area = "";
            size = Integer.valueOf(comVarService.getComVarValueByName("IndexPageSize"));
        } else {
            size = Integer.valueOf(comVarService.getComVarValueByName("AreaPageSize"));
        }

        String[] cate = new String[]{"Java", "Obj-C", "C", "C++", "IOS", "Android"};
        String[] high = new String[]{"TOP", "NOTICE", "OTHER", "SYSTEM", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""};
        String[] users = new String[]{"Admin", "Test", "Myas", "Liakx", "Google", "vsss"};
        Date now = new Date();
        List<Article> list = new ArrayList<>();
        for (int i = 0; i < size; i++) {
            list.add(new Article("/themes/" + Key.kvs.get("Theme") + "/images/wireframe/image.png", "The friction between your thoughts and your code" + page, "/t/hello" + new Random().nextInt(1000), cate[new Random().nextInt(cate.length - 1)], users[new Random().nextInt(users.length - 1)], new Random().nextInt(100),
                    RelativeDate.format(RelativeDate.randomDate("2015-05-11 13:00:00", now), now), users[new Random().nextInt(users.length - 1)], page, high[new Random().nextInt(high.length - 1)]));
        }

        Page<Article> articlePage = new Page<>();
        articlePage.setPageSize(30);
        articlePage.setTotalPage(200);
        articlePage.setPageNumber(page);
        articlePage.setResult(list);
        return articlePage;
    }

    @Inject
    ComVarService comVarService;

    @Inject
    SilentGoConfig silentGoConfig;

    @Inject
    TopicDao topicDao;
    @Inject
    EventFactory eventFactory;

    public boolean createTopic(Topic topic) {

        Assert.isNotNull(topic, "main parameter can not be null");
        Assert.isNotBlank(topic.getContent(), "文章内容不能为空");
        Assert.isNotBlank(topic.getTitle(), "文章标题不能为空");
        Assert.isNotNull(topic.getAreaId(), "区域不能为空");
        Assert.isNotNull(topic.getUserId(), "用户不能为空");


        Integer intervalSeconds = Integer.parseInt(comVarService.getComVarValueByName("PublishTopicInterval"));
        Date lastPublishTime = (Date) silentGoConfig.getCacheManager().get("topicPublishCache", topic.getUserId());
        if (lastPublishTime != null && DateKit.addSeconds(lastPublishTime, intervalSeconds).getTime() > new Date().getTime()) {
            throw new AppBusinessException("主题发布速度太快");
        }
        if (areaDao.countWhereId(topic.getAreaId(), true, true, false) != 1) {
            throw new AppBusinessException("区域ID不正确");
        }

        silentGoConfig.getCacheManager().set("topicPublishCache", topic.getUserId(), new Date());
        topic.setId(null);
        topic.setCreateTime(new Date());
        topic.setIsClose(false);
        topic.setIsVisible(true);
        topic.setIsComment(true);
        topic.setIsDelete(false);
        topic.setUrl(" ");
        int i = topicDao.insertByRow(topic);

        Assert.isTrue(i == 1, "主题创建失败");

        eventFactory.emit(new TopicEvent(topic));

        return true;
    }

}
