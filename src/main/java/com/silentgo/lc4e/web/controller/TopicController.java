package com.silentgo.lc4e.web.controller;

import com.silentgo.core.aop.validator.annotation.RequestBool;
import com.silentgo.core.aop.validator.annotation.RequestInt;
import com.silentgo.core.aop.validator.annotation.RequestString;
import com.silentgo.core.ioc.annotation.Inject;
import com.silentgo.core.route.annotation.*;
import com.silentgo.lc4e.database.model.Comment;
import com.silentgo.lc4e.database.model.SysConfig;
import com.silentgo.lc4e.database.model.Topic;
import com.silentgo.lc4e.database.model.User;
import com.silentgo.lc4e.entity.Message;
import com.silentgo.lc4e.entity.ReturnData;
import com.silentgo.lc4e.tool.Lc4eCaptchaRender;
import com.silentgo.lc4e.web.service.CurUserService;
import com.silentgo.lc4e.web.service.TopicService;
import com.silentgo.servlet.http.Request;
import com.silentgo.servlet.http.RequestMethod;
import com.silentgo.servlet.http.Response;
import org.apache.shiro.SecurityUtils;
import org.apache.shiro.authc.UsernamePasswordToken;
import org.apache.shiro.authz.annotation.RequiresUser;
import org.apache.shiro.subject.Subject;

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


    /**
     * visit topic
     *
     * @param request
     * @param topicpath
     * @return
     */
    @Route("/{topic}")
    @RouteMatch(method = RequestMethod.GET)
    public String t(Request request, @PathVariable("topic") @RequestString String topicpath) {
        return "index.html";
    }

    @Route("/{topic}/{page:[1-9][0-9]*}")
    @RouteMatch(method = RequestMethod.POST)
    public String t(Request request) {
        return "index.html";
    }

    @Route("/{topic}")
    @RouteMatch(method = RequestMethod.POST)
    @ResponseBody
    public Message topicInfo(Request request, @PathVariable("topic") String topic) {
        return new Message(true, new ReturnData("topic", topicService.getTopicDetail(Long.parseLong(topic))));
    }

    /**
     * page topic data
     *
     * @param request
     * @param topicpath
     * @param page
     * @return
     */
    @Route("/{topic}/{page:[1-9][0-9]*}")
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
    public Message newTopic(Request request, @RequestParam("topic") Topic topic) {
        User user = curUserService.getCurrentUser();
        topic.setUserId(user.getId());

        return new Message(topicService.createTopic(topic), "主题创建成功");
    }

    /**
     * view
     * @param request
     * @return
     */
    @Route("/new/{area}")
    public String newTopic(Request request) {
        return "index.html";
    }

    @Route("/new")
    public String newTopic() {
        return "index.html";
    }
}
