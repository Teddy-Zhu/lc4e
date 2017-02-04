package com.silentgo.lc4e.web.controller;

import com.silentgo.core.aop.validator.annotation.RequestInt;
import com.silentgo.core.ioc.annotation.Inject;
import com.silentgo.core.route.annotation.*;
import com.silentgo.lc4e.database.model.Comment;
import com.silentgo.lc4e.database.model.Topic;
import com.silentgo.lc4e.database.model.User;
import com.silentgo.lc4e.database.model.VwCommentDetail;
import com.silentgo.lc4e.entity.Message;
import com.silentgo.lc4e.entity.ReturnData;
import com.silentgo.lc4e.web.service.ComVarService;
import com.silentgo.lc4e.web.service.CommentService;
import com.silentgo.lc4e.web.service.CurUserService;
import com.silentgo.lc4e.web.service.TopicService;
import com.silentgo.servlet.http.Request;
import com.silentgo.servlet.http.RequestMethod;
import com.silentgo.utils.Assert;
import org.apache.shiro.authz.annotation.RequiresAuthentication;
import org.apache.shiro.authz.annotation.RequiresUser;

import java.util.ArrayList;

/**
 * Project : lc4e
 * Package : com.silentgo.lc4e.web.controller
 *
 * @author <a href="mailto:teddyzhu15@gmail.com" target="_blank">teddyzhu</a>
 *         <p>
 *         Created by teddyzhu on 2016/10/28.
 */
@Controller
@Route("/t")
public class TopicController {

    @Inject
    CommentService commentService;


    @Route("/{topic:([0-9a-zA-Z]{4,})}/reply")
    @RouteMatch(method = RequestMethod.POST)
    @ResponseBody
    @RequiresUser
    @RequiresAuthentication
    public Message reply(@RequestParam Comment comment, @PathVariable("topic") String url) {


        commentService.replyTopicByUrl(url, comment);
        VwCommentDetail commentDetail = new VwCommentDetail();
        commentDetail.setId(comment.getId());
        commentDetail.setDown(comment.getDown());
        commentDetail.setTop(comment.getTop());
        commentDetail.setCreateTime(comment.getCreateTime());
        commentDetail.setContent(comment.getContent());
        User user = curUserService.getCurrentUser();
        commentDetail.setImg(user.getImg());
        commentDetail.setNick(user.getNick());

        return new Message(true, new ReturnData("comment", commentDetail));
    }

    @Route("/{topic:([0-9a-zA-Z]{4,})}/info")
    @RouteMatch(method = RequestMethod.POST)
    @ResponseBody
    public Message topicInfo(Request request, @PathVariable("topic") String url) {
        return new Message(true,
                new ReturnData("topic", topicService.getTopicDetail(url))
        );
    }

    @Inject
    ComVarService comVarService;

    /**
     * page topic data
     *
     * @param request
     * @param topicpath
     * @param page
     * @return
     */
    @Route("/{topic:([0-9a-zA-Z]{4,})}/comment/{page:([1-9][0-9]*)}")
    @RouteMatch(method = RequestMethod.POST)
    @ResponseBody
    public Message getComments(Request request, @PathVariable("topic") String topicpath, @PathVariable @RequestInt(range = {1, Integer.MAX_VALUE}, defaultValue = "1") Integer page) {

        Integer size = Integer.valueOf(comVarService.getComVarValueByName("CommentSize"));
        return new Message(true, new ReturnData("comments", commentService.getComments(size, page, topicpath)));
    }

    @Inject
    CurUserService curUserService;

    @Inject
    TopicService topicService;

    /**
     * post create new topic
     *
     * @param request
     * @return
     */
    @Route("/new")
    @ResponseBody
    @RouteMatch(method = RequestMethod.POST)
    @RequiresUser
    public Message newTopic(Request request, @RequestParam Topic topic) {
        User user = curUserService.getCurrentUser();
        topic.setUserId(user.getId());
        boolean result = topicService.createTopic(topic);
        Topic ret = new Topic();
        ret.setUrl(topic.getUrl());
        return new Message(result, "主题创建成功", new ReturnData("topic", ret));
    }

    /**
     * view new topc , visit topic
     *
     * @param request
     * @return
     */
    @Route({"/new/{area}", "/{topic:([0-9a-zA-Z]{4,})}", "/{topic:([0-9a-zA-Z]{4,})}/{page:([1-9][0-9]*)}"})
    @RouteMatch(method = RequestMethod.GET)
    public String newTopic(Request request) {
        return "index.html";
    }


    @Route("/new")
    public String newTopic() {
        return "index.html";
    }
}
