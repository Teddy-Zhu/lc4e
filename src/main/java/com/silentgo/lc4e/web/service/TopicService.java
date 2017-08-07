package com.silentgo.lc4e.web.service;

import com.hankcs.hanlp.HanLP;
import com.silentgo.core.config.SilentGoConfig;
import com.silentgo.core.db.intercept.Transaction;
import com.silentgo.core.ioc.annotation.Inject;
import com.silentgo.core.ioc.annotation.Service;
import com.silentgo.core.plugin.event.EventFactory;
import com.silentgo.lc4e.database.dao.AreaDao;
import com.silentgo.lc4e.database.dao.TopicDao;
import com.silentgo.lc4e.database.dao.TopicStatisticsDao;
import com.silentgo.lc4e.database.dao.VwTopicDetailDao;
import com.silentgo.lc4e.database.model.Topic;
import com.silentgo.lc4e.database.model.TopicStatistics;
import com.silentgo.lc4e.database.model.User;
import com.silentgo.lc4e.database.model.VwTopicDetail;
import com.silentgo.lc4e.util.exception.AppBusinessException;
import com.silentgo.lc4e.web.event.TopicEvent;
import com.silentgo.lc4e.web.event.VisitTopic;
import com.silentgo.lc4e.web.request.TodayHotTopicSearch;
import com.silentgo.lc4e.web.request.TopicSearch;
import com.silentgo.lc4e.web.response.TopicRes;
import com.silentgo.lc4e.web.response.TopicSRes;
import com.silentgo.lc4e.web.service.model.SimpleTopicInfo;
import com.silentgo.orm.model.Page;
import com.silentgo.utils.*;

import java.math.BigDecimal;
import java.util.*;

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
    public Page<TopicRes> getTopicByUserLike(String area, int page, int size) {
        User user = curUserService.getCurrentUser();
        if (user == null) return new Page<>();

        List<String> userTags = tagService.getUserTags(user.getId());
        Date date = getDate();
        Page<TopicRes> result = buildDetailModel(date, area, page, size);

        List<VwTopicDetail> list = vwTopicDetailDao.queryUserLikeWhereOrderByLimit(area, date, true, false, StringKit.join(userTags, ","), result.getPager());

        List<TopicRes> topicRes = new ArrayList<>();

        for (VwTopicDetail vwTopicDetail : list) {
            TopicRes topicRes1 = new TopicRes();
            ReflectKit.copyProperties(vwTopicDetail, topicRes1);
            topicRes.add(topicRes1);
        }
        result.setResult(topicRes);

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
    public Page<TopicRes> getTopic(String area, int order, int page, int size) {
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

    public Page<TopicRes> getTopicByCommentCount(String area, int page, int size) {
        Date date = getDate();
        Page<TopicRes> result = buildDetailModel(date, area, page, size);

        List<VwTopicDetail> list = vwTopicDetailDao.queryWhereOrderByCommentCountDescLimit(date, true, false, result.getPager(), area);

        List<TopicRes> topicRes = new ArrayList<>();

        for (VwTopicDetail vwTopicDetail : list) {
            TopicRes topicRes1 = new TopicRes();
            ReflectKit.copyProperties(vwTopicDetail, topicRes1);
            topicRes.add(topicRes1);
        }

        result.setResult(topicRes);

        return result;
    }

    public Page<TopicRes> getTopicByLast(String area, int page, int size) {
        Date date = getDate();
        Page<TopicRes> result = buildDetailModel(date, area, page, size);

        List<VwTopicDetail> list = vwTopicDetailDao.queryWhereOrderByCuserTimeDescLimit(date, true, false, result.getPager(), area);

        List<TopicRes> topicRes = new ArrayList<>();

        for (VwTopicDetail vwTopicDetail : list) {
            TopicRes topicRes1 = new TopicRes();
            ReflectKit.copyProperties(vwTopicDetail, topicRes1);
            topicRes.add(topicRes1);
        }

        result.setResult(topicRes);

        return result;
    }

    public Page<TopicRes> getTopicByPubDate(String area, int page, int size) {

        Date date = getDate();

        Page<TopicRes> result = buildDetailModel(date, area, page, size);

        List<VwTopicDetail> list = vwTopicDetailDao.queryWhereOrderByCreateTimeDescLimit(date, true, false, result.getPager(), area);

        List<TopicRes> topicRes = new ArrayList<>();

        for (VwTopicDetail vwTopicDetail : list) {
            TopicRes topicRes1 = new TopicRes();
            ReflectKit.copyProperties(vwTopicDetail, topicRes1);
            topicRes.add(topicRes1);
        }

        result.setResult(topicRes);

        return result;
    }

    /**
     * backend
     *
     * @return
     */
    public Page<TopicSRes> getTopicList(TopicSearch topicSearch) {
        Assert.isNotNull(topicSearch, "参数非法");

        int count = vwTopicDetailDao.countWhere(topicSearch.getCreateBeginTime(),
                topicSearch.getCreateEndTime(), topicSearch.getUpdateBeginTime(), topicSearch.getUpdateEndTime(),
                topicSearch.getArea(), topicSearch.isVisible(), topicSearch.isDelete(), topicSearch.isClose(),
                topicSearch.isComment());

        Page<TopicSRes> result = new Page<>();
        result.setPageNumber(topicSearch.getPageNum());
        result.setPageSize(topicSearch.getPageSize());
        result.setTotalCount(count);

        List<VwTopicDetail> list = vwTopicDetailDao.queryWhereOrderByCreateTimeDescLimit(topicSearch.getCreateBeginTime(),
                topicSearch.getCreateEndTime(), topicSearch.getUpdateBeginTime(), topicSearch.getUpdateEndTime(),
                topicSearch.getArea(), topicSearch.isVisible(), topicSearch.isDelete(), topicSearch.isClose(),
                topicSearch.isComment(), result.getPager());
        List<TopicSRes> topicSRes = new ArrayList<>();
        for (VwTopicDetail vwTopicDetail : list) {
            TopicSRes topicRes = new TopicSRes();
            ReflectKit.copyProperties(vwTopicDetail, topicRes);
            topicSRes.add(topicRes);
        }
        result.setResult(topicSRes);

        return result;
    }

    private Date getDate() {
        Integer month = Integer.valueOf(comVarService.getComVarValueByName("ShowLastMonthTopic"));
        Date date = null;
        if (month != -1)
            date = DateKit.addMonths(new Date(), 3);
        return date;
    }

    private Page<TopicRes> buildDetailModel(Date date, String area, int page, int size) {

        int total = vwTopicDetailDao.countWhere(date, true, false, area);

        Page<TopicRes> result = new Page<>();
        result.setPageNumber(page);
        result.setPageSize(size);
        pageFilter.filterPage(result);
        result.setTotalCount(total);
        return result;
    }

    public TopicRes getTopicDetail(String url) {
        Assert.isNotBlank(url, "主题不存在");

        Long id = urlGenerateService.getId(url);

        VwTopicDetail vwTopicDetail = new VwTopicDetail();
        vwTopicDetail.setIsDelete(false);
        vwTopicDetail.setId(id);
        List<VwTopicDetail> details = vwTopicDetailDao.queryByModelSelective(vwTopicDetail);

        Assert.isNotEmpty(details, "主题不存在");

        eventFactory.emit(new VisitTopic(details.get(0)));


        TopicRes topicRes = new TopicRes();
        ReflectKit.copyProperties(details.get(0), topicRes);
        return topicRes;
    }

    @Inject
    ConfigService comVarService;

    @Inject
    SilentGoConfig silentGoConfig;

    @Inject
    TopicDao topicDao;
    @Inject
    EventFactory eventFactory;

    @Inject
    TopicStatisticsDao topicStatisticsDao;

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

        List<String> tags = buildTags(topic.getTitle(), topic.getContent());

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

        tagService.addTags(tags.toArray(new String[0]));

        eventFactory.emit(new TopicEvent(topic));

        silentGoConfig.getCacheManager().set("topicPublishCache", topic.getUserId(), new Date());

        return true;
    }

    /**
     * backend
     *
     * @param id
     * @return
     */
    public TopicRes getTopicDetail(Long id) {

        Assert.isNotNull(id, "参数非法");

        VwTopicDetail vwTopicDetail = new VwTopicDetail();
        vwTopicDetail.setId(id);
        List<VwTopicDetail> details = vwTopicDetailDao.queryByModelSelective(vwTopicDetail);

        Assert.isNotEmpty(details, "主题不存在");

        TopicRes topicRes = new TopicRes();
        ReflectKit.copyProperties(details.get(0), topicRes);

        return topicRes;
    }

    /**
     * backend
     *
     * @param topic
     * @return
     */
    public boolean editTopic(Topic topic) {

        Assert.isNotNull(topic, "main parameter can not be null");
        Assert.isNotBlank(topic.getContent(), "文章内容不能为空");
        Assert.isNotBlank(topic.getTitle(), "文章标题不能为空");
        Assert.isNotNull(topic.getAreaId(), "区域不能为空");
        Assert.isNotNull(topic.getUserId(), "用户不能为空");
        Assert.isNotNull(topic.getId(), "参数非法");

        Topic origin = topicDao.queryByPrimaryKey(topic.getId());

        Assert.isNotNull(origin, "文章不存在");
        //Assert.isTrue(origin.getUserId().equals(topic.getUserId()), "不能编辑他人的文章");


        List<String> tags = buildTags(topic.getTitle(), topic.getContent());


        String tagString = StringKit.join(tags, ",");
        if (origin.getTags() != null && !tagString.equals(origin.getTags())) {
            topic.setTags(tagString);
            tagService.addTags(tags.toArray(new String[0]));
        }
        topic.setCreateTime(null);
//        topic.setIsClose(false);
//        topic.setIsVisible(true);
//        topic.setIsComment(true);
//        topic.setIsDelete(false);
//        topic.setUrl(" ");
//        topic.setViewCount(0);
//        topic.setCommentCount(0);
//        topic.setDown(0);
//        topic.setTop(0);
//        topic.setRank(new BigDecimal(0));
        topic.setUserId(null);
        topic.setUpdateTime(new Date());

        int ret = topicDao.updateByPrimaryKeySelective(topic);
        return ret == 1;
    }

    private List<String> buildTags(String title, String content) {
        List<String> tags = HanLP.extractKeyword(content, 4);

        Iterator tagIterator = tags.iterator();
        while (tagIterator.hasNext()) {
            String tag = (String) tagIterator.next();
            if (title.trim().equals(tag) || content.equals(tag)) {
                tagIterator.remove();
            }
        }
        return tags;
    }

    /**
     * 获取今日热门主题
     *
     * @param todayHotTopicSearch
     * @return
     */
    public SimpleTopicInfo[] getTodayHotTopics(TodayHotTopicSearch todayHotTopicSearch) {

        int size = todayHotTopicSearch.getSize();
        Long areaId = todayHotTopicSearch.getAreaId();


        Map<String, Object> queryMap = new HashMap<>();

        queryMap.put("time", DateKit.removeTime(new Date()));
        queryMap.put("areaId", areaId);
        queryMap.put("orderBy", "reply_count desc");
        queryMap.put("limitBy", " 0," + size);
        List<TopicStatistics> topics = topicStatisticsDao.queryByModelMap(queryMap);

        final long[] topicIds = CollectionKit.isEmpty(topics) ? new long[0] : topics.stream().mapToLong(TopicStatistics::getTopicId).toArray();

        List<SimpleTopicInfo> simpleTopicInfos;
        if (topicIds.length == 0) {
            simpleTopicInfos = new ArrayList<>();
        } else {
            simpleTopicInfos = topicDao.queryListWhere(topicIds);
        }

        SimpleTopicInfo[] sortedInfos = new SimpleTopicInfo[simpleTopicInfos.size()];

        for (int i = 0; i < topicIds.length; i++) {
            int finalI = i;
            sortedInfos[i] = simpleTopicInfos.stream().filter(simpleTopicInfo -> simpleTopicInfo.getId().equals(topicIds[finalI])).findFirst().get();
        }
        return sortedInfos;
    }
}
