package com.silentgo.lc4e.web.controller;


import com.silentgo.core.ioc.annotation.Inject;
import com.silentgo.core.render.RenderModel;
import com.silentgo.core.route.annotation.Controller;
import com.silentgo.core.route.annotation.PathVariable;
import com.silentgo.core.route.annotation.Route;
import com.silentgo.lc4e.tool.Lc4eCaptchaRender;
import com.silentgo.lc4e.web.service.ComVarService;
import com.silentgo.lc4e.web.service.TopicService;
import com.silentgo.servlet.http.Request;
import com.silentgo.servlet.http.Response;
import com.silentgo.utils.log.Log;
import com.silentgo.utils.log.LogFactory;

/**
 * Created by teddy on 2015/7/18.
 */
@Controller
@Route("/")
public class ViewController {

    private static final Log log = LogFactory.get(ViewController.class);

    @Inject
    TopicService topicService;
    @Inject
    ComVarService comVarService;

    @Route("/")
    public String index(Request request) {
        return "index.html";
    }


    @Route("/{page:([1-9][0-9]*)}/{order:([1-3])}")
    public String index(@PathVariable Integer page, @PathVariable Integer order) {
        return "index.html";
    }


    @Route
    public RenderModel captcha(Request request, Response response) {
        return new RenderModel(new Lc4eCaptchaRender(), null, request, response);
    }

    @Route
    public String TopHots() {
        return "topHotTest.html";
    }


}
