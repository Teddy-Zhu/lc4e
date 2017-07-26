package com.silentgo.lc4e.web.controller;

import com.silentgo.core.ioc.annotation.Inject;
import com.silentgo.core.route.annotation.*;
import com.silentgo.lc4e.entity.Message;
import com.silentgo.lc4e.web.request.TopicReq;
import com.silentgo.lc4e.web.request.TopicSearch;
import com.silentgo.lc4e.web.service.CurUserService;
import com.silentgo.lc4e.web.service.TopicService;
import com.silentgo.servlet.http.RequestMethod;
import org.apache.shiro.authz.annotation.RequiresPermissions;

/**
 * Project : lc4e
 * Package : com.silentgo.lc4e.web.controller
 *
 * @author <a href="mailto:teddyzhu15@gmail.com" target="_blank">teddyzhu</a>
 *         <p>
 *         Created by teddyzhu on 2017/2/16.
 */
@Controller
@Route("/manage")
public class BackManageController {

    @Inject
    CurUserService curUserService;


    @Inject
    TopicService topicService;


    @RouteMatch(method = RequestMethod.POST)
    @ResponseBody
    @RequiresPermissions("manage.topic")
    @Route("/topic/edit")
    public Message editTopic(@RequestBody TopicReq topic) {
        // User user = curUserService.getCurrentUser();
        // topic.setUserId(user.getId());

        return new Message(topicService.editTopic(topic));
    }


    @RouteMatch(method = RequestMethod.POST)
    @ResponseBody
    @RequiresPermissions("manage.topic")
    @Route("/topic/query")
    public Message queryTopicList(@RequestBody TopicSearch topicSearch) {
        return new Message("page", topicService.getTopicList(topicSearch));
    }
}
