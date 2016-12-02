package com.silentgo.lc4e.web.service;

import com.silentgo.core.db.intercept.Transaction;
import com.silentgo.core.ioc.annotation.Inject;
import com.silentgo.core.ioc.annotation.Service;
import com.silentgo.core.plugin.event.EventFactory;
import com.silentgo.lc4e.database.dao.CommentDao;
import com.silentgo.lc4e.database.dao.TopicDao;
import com.silentgo.lc4e.database.dao.VwCommentDetailDao;
import com.silentgo.lc4e.database.model.Comment;
import com.silentgo.lc4e.database.model.User;
import com.silentgo.lc4e.database.model.VwCommentDetail;
import com.silentgo.lc4e.web.event.ReplyEvent;
import com.silentgo.orm.model.Page;
import com.silentgo.utils.Assert;

import java.util.Date;
import java.util.List;

/**
 * Project : lc4e
 * Package : com.silentgo.lc4e.web.service
 *
 * @author <a href="mailto:teddyzhu15@gmail.com" target="_blank">teddyzhu</a>
 *         <p>
 *         Created by teddyzhu on 2016/11/30.
 */
@Service
public class CommentService {

    @Inject
    CommentDao commentDao;

    @Inject
    TopicDao topicDao;

    @Inject
    UrlGenerateService urlGenerateService;
    @Inject
    CurUserService curUserService;

    @Inject
    EventFactory eventFactory;

    public void replyTopicByUrl(String url, Comment comment) {
        Assert.isNotBlank(url, "主题不存在");
        Assert.isNotNull(comment, "参数错误");
        Assert.isNotBlank(comment.getContent(), "回复内容不能为空");

        Long id = urlGenerateService.getId(url);

        int i = topicDao.countWhereId(id);
        Assert.isTrue(i == 1, "主题不存在");

        comment.setId(null);
        comment.setTopicId(id);
        comment.setCreateTime(new Date());

        comment.setIsVisible(true);
        User user = curUserService.getCurrentUser();
        comment.setUserId(user.getId());

        comment.setReferFloor("");
        comment.setReferUser("");

        int ret = commentDao.insertByRow(comment);
        Assert.isTrue(ret == 1, "评论失败");

        eventFactory.emit(new ReplyEvent(comment));
    }

    @Inject
    VwCommentDetailDao vwCommentDetailDao;

    @Inject
    PageFilter pageFilter;

    public Page<VwCommentDetail> getComments(int size, int page, String url) {
        Assert.isNotBlank(url, "主题不存在");

        Long topicId = urlGenerateService.getId(url);

        Page<VwCommentDetail> comments = new Page<>();
        comments.setPageSize(size);
        comments.setPageNumber(page);
        pageFilter.filterPage(comments, 20);
        int total = commentDao.countWhereTopicIdAndisVisible(topicId, true);
        comments.setTotalCount(total);

        List<VwCommentDetail> list = vwCommentDetailDao.queryWhereTopicIdAndisVisible(topicId, true);

        comments.setResult(list);

        return comments;
    }
}
