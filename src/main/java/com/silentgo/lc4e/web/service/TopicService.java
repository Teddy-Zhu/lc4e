package com.silentgo.lc4e.web.service;

import com.hankcs.hanlp.HanLP;
import com.silentgo.core.config.SilentGoConfig;
import com.silentgo.core.db.intercept.Transaction;
import com.silentgo.core.ioc.annotation.Inject;
import com.silentgo.core.ioc.annotation.Service;
import com.silentgo.core.plugin.event.EventFactory;
import com.silentgo.lc4e.database.dao.AreaDao;
import com.silentgo.lc4e.database.dao.TopicDao;
import com.silentgo.lc4e.database.dao.VwTopicDetailDao;
import com.silentgo.lc4e.database.model.Topic;
import com.silentgo.lc4e.database.model.User;
import com.silentgo.lc4e.database.model.VwTopicDetail;
import com.silentgo.lc4e.util.exception.AppBusinessException;
import com.silentgo.lc4e.web.event.TopicEvent;
import com.silentgo.lc4e.web.event.VisitTopic;
import com.silentgo.orm.model.Page;
import com.silentgo.utils.Assert;
import com.silentgo.utils.DateKit;
import com.silentgo.utils.StringKit;
import org.hashids.Hashids;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

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

    @Inject
    TagService tagService;

    /**
     * @param area
     * @param page
     * @param size
     * @return
     */
    public Page<VwTopicDetail> getTopicByUserLike(String area, int page, int size) {
        User user = curUserService.getCurrentUser();
        if (user == null) return new Page<>();

        List<String> userTags = tagService.getUserTags(user.getId());
        Date date = getDate();
        Page<VwTopicDetail> result = buildDetailModel(date, area, page, size);

        List<VwTopicDetail> list = vwTopicDetailDao.queryUserLikeWhereOrderLimit(area, date, true, false, StringKit.join(userTags, ","), result.getStart(), result.getPageSize());

        result.setResult(list);

        return result;
    }

    /**
     * all topic in time range(default 3 month)
     *
     * @param order 1: by topic publish time
     *              2: by last reply time
     *              3: by comment count
     *              4: by user favorite tag
     * @return
     */
    public Page<VwTopicDetail> getTopic(String area, int order, int page, int size) {
        switch (order) {
            case 4:
                return getTopicByUserLike(area, page, size);
            case 1:
                return getTopicByPubDate(area, page, size);
            case 2:
                return getTopicByLast(area, page, size);
            case 3:
                return getTopicByCommentCount(area, page, size);
            default:
                return new Page<>();
        }
    }

    public Page<VwTopicDetail> getTopicByCommentCount(String area, int page, int size) {
        Date date = getDate();
        Page<VwTopicDetail> result = buildDetailModel(date, area, page, size);

        List<VwTopicDetail> list = vwTopicDetailDao.queryWhereOrderByCommentCountDescLimit(date, true, false, result.getStart(), result.getPageSize(), area);

        result.setResult(list);

        return result;
    }

    public Page<VwTopicDetail> getTopicByLast(String area, int page, int size) {
        Date date = getDate();
        Page<VwTopicDetail> result = buildDetailModel(date, area, page, size);

        List<VwTopicDetail> list = vwTopicDetailDao.queryWhereOrderByCuserTimeDescLimit(date, true, false, result.getStart(), result.getPageSize(), area);

        result.setResult(list);

        return result;
    }

    public Page<VwTopicDetail> getTopicByPubDate(String area, int page, int size) {

        Date date = getDate();

        Page<VwTopicDetail> result = buildDetailModel(date, area, page, size);

        List<VwTopicDetail> list = vwTopicDetailDao.queryWhereOrderByCreateTimeDescLimit(date, true, false, result.getStart(), result.getPageSize(), area);

        result.setResult(list);

        return result;
    }

    private Date getDate() {
        Integer month = Integer.valueOf(comVarService.getComVarValueByName("ShowLastMonthTopic"));
        Date date = null;
        if (month != -1)
            date = DateKit.addMonths(new Date(), 3);
        return date;
    }

    private Page<VwTopicDetail> buildDetailModel(Date date, String area, int page, int size) {

        int total = vwTopicDetailDao.countWhere(date, true, false, area);

        Page<VwTopicDetail> result = new Page<>();
        result.setPageNumber(page);
        result.setPageSize(size);
        pageFilter.filterPage(result);
        result.setTotalCount(total);
        return result;
    }

    public VwTopicDetail getTopicDetail(String url) {
        Assert.isNotBlank(url, "主题不存在");

        Long id = urlGenerateService.getId(url);

        VwTopicDetail detail = vwTopicDetailDao.queryByPrimaryKey(id);

        eventFactory.emit(new VisitTopic(detail));
        return detail;
    }

    @Inject
    ComVarService comVarService;

    @Inject
    SilentGoConfig silentGoConfig;

    @Inject
    TopicDao topicDao;
    @Inject
    EventFactory eventFactory;

    @Inject
    UrlGenerateService urlGenerateService;

    @Transaction
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

        topic.setId(null);
        topic.setCreateTime(new Date());
        topic.setIsClose(false);
        topic.setIsVisible(true);
        topic.setIsComment(true);
        topic.setIsDelete(false);
        topic.setUrl(" ");
        topic.setViewCount(0);
        topic.setCommentCount(0);
        topic.setDown(0);
        topic.setTop(0);
        topic.setRank(new BigDecimal(0));

        List<String> tags = HanLP.extractKeyword(topic.getTitle() + topic.getContent(), 4);

        topic.setTags(StringKit.join(tags, ","));

        int i = topicDao.insertByRow(topic);

        Assert.isTrue(i == 1, "主题创建失败");


        //generate url
        String url = urlGenerateService.getUrl(topic.getId());
        topic.setUrl(url);
        Topic update = new Topic();
        update.setId(topic.getId());
        update.setUrl(url);
        i = topicDao.updateByPrimaryKeySelective(update);

        Assert.isTrue(i == 1, "主题创建url失败");

        eventFactory.emit(new TopicEvent(topic));

        silentGoConfig.getCacheManager().set("topicPublishCache", topic.getUserId(), new Date());

        return true;
    }


}
