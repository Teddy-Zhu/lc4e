package com.silentgo.lc4e.web.controller;

import com.silentgo.core.aop.validator.annotation.RequestInt;
import com.silentgo.core.ioc.annotation.Inject;
import com.silentgo.core.route.annotation.*;
import com.silentgo.lc4e.database.model.Comment;
import com.silentgo.lc4e.database.model.Topic;
import com.silentgo.lc4e.database.model.User;
import com.silentgo.lc4e.entity.Message;
import com.silentgo.lc4e.entity.ReturnData;
import com.silentgo.lc4e.web.service.CurUserService;
import com.silentgo.lc4e.web.service.TopicService;
import com.silentgo.servlet.http.Request;
import com.silentgo.servlet.http.RequestMethod;
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


    @Route("/{topic:([0-9a-zA-Z]{4,})}")
    @RouteMatch(method = RequestMethod.POST)
    @ResponseBody
    public Message topicInfo(Request request, @PathVariable("topic") String url) {
        return new Message(true, new ReturnData("topic", topicService.getTopicDetail(url)));
    }

    /**
     * page topic data
     *
     * @param request
     * @param topicpath
     * @param page
     * @return
     */
    @Route("/{topic:([0-9a-zA-Z]{4,})}/{page:([1-9][0-9]*)}")
    @RouteMatch(method = RequestMethod.POST)
    @ResponseBody
    public Message t2(Request request, @PathVariable("topic") String topicpath, @PathVariable @RequestInt(range = {1, Integer.MAX_VALUE}, defaultValue = "1") Integer page) {
        return new Message(true, new ReturnData("topic", new Topic()),
                new ReturnData("comments", new ArrayList<Comment>() {{
                    add(new Comment());
                }}));
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
