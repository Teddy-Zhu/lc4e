package com.silentgo.lc4e.web.controller;

import com.silentgo.core.aop.validator.annotation.RequestInt;
import com.silentgo.core.aop.validator.annotation.RequestString;
import com.silentgo.core.ioc.annotation.Inject;
import com.silentgo.core.route.annotation.*;
import com.silentgo.lc4e.config.Key;
import com.silentgo.lc4e.entity.Article;
import com.silentgo.lc4e.entity.Message;
import com.silentgo.lc4e.entity.Popup;
import com.silentgo.lc4e.entity.ReturnData;
import com.silentgo.lc4e.tool.RelativeDate;
import com.silentgo.lc4e.web.service.ComVarService;
import com.silentgo.lc4e.web.service.TopicService;
import com.silentgo.orm.model.Page;
import com.silentgo.servlet.http.Request;
import com.silentgo.servlet.http.RequestMethod;
import com.silentgo.utils.StringKit;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Random;

/**
 * Project : lc4e
 * Package : com.silentgo.lc4e.web.controller
 *
 * @author <a href="mailto:teddyzhu15@gmail.com" target="_blank">teddyzhu</a>
 *         <p>
 *         Created by teddyzhu on 2016/10/28.
 */
@Controller
@Route("/a")
public class AreaController {

    @Inject
    ComVarService comVarService;

    @Inject
    TopicService topicService;


    @Route({"/{area}/{page:([1-9][0-9]*)}/{order:([1-3])}", "/{area}"})
    @RouteMatch(method = RequestMethod.GET)
    public String a(Request request) {
        return "index.html";
    }

    @Route("/{area}/{page:([1-9][0-9]*)}/{order:([1-3])}")
    @RouteMatch(method = RequestMethod.POST)
    @ResponseBody
    public Message a2(Request request, @PathVariable String area, @PathVariable @RequestInt(range = {1, Integer.MAX_VALUE}) Integer page, @PathVariable Integer order) {
        if ("all".equalsIgnoreCase(area)) area = null;
        Integer size = Integer.parseInt(comVarService.getComVarValueByName("AreaPageSize"));
        return new Message(true, new ReturnData("area", area),
                new ReturnData("topics", topicService.getTopic(area, order, page, size)));
    }


}
