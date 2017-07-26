package com.silentgo.lc4e.web.controller;

import com.silentgo.core.ioc.annotation.Inject;
import com.silentgo.core.route.annotation.Controller;
import com.silentgo.core.route.annotation.ResponseBody;
import com.silentgo.core.route.annotation.Route;
import com.silentgo.lc4e.util.geetest.GeetestLib;
import com.silentgo.servlet.http.Request;
import com.silentgo.utils.PropKit;

/**
 * Project : lc4e
 * Package : com.silentgo.lc4e.web.controller
 *
 * @author <a href="mailto:teddyzhu15@gmail.com" target="_blank">teddyzhu</a>
 *         <p>
 *         Created by teddyzhu on 2017/7/17.
 */
@Controller
@Route("/geetest")
public class GeetestController {

    @Inject
    PropKit propKit;

    @Route("/init")
    @ResponseBody
    public String init(Request request) {
        GeetestLib geetestLib = new GeetestLib(GeetestLib.getId(propKit), GeetestLib.getKey(propKit), true);

        int ret = geetestLib.preProcess();

        //todo 分布式问题
        request.getSession().setAttribute(geetestLib.gtServerStatusSessionKey, ret);
        return geetestLib.getResponseStr();
    }

}
