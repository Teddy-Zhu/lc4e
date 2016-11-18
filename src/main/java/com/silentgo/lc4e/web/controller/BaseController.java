package com.silentgo.lc4e.web.controller;

import com.silentgo.core.ioc.annotation.Inject;
import com.silentgo.core.route.annotation.Controller;
import com.silentgo.core.route.annotation.ResponseBody;
import com.silentgo.core.route.annotation.Route;
import com.silentgo.core.route.annotation.RouteMatch;
import com.silentgo.lc4e.entity.Message;
import com.silentgo.lc4e.entity.ReturnData;
import com.silentgo.lc4e.web.service.AreaService;
import com.silentgo.servlet.http.RequestMethod;

/**
 * Project : lc4e
 * Package : com.silentgo.lc4e.web.controller
 *
 * @author <a href="mailto:teddyzhu15@gmail.com" target="_blank">teddyzhu</a>
 *         <p>
 *         Created by teddyzhu on 2016/11/16.
 */
@Route("/base")
@Controller
public class BaseController {

    @Inject
    AreaService areaService;

    @Route("/area")
    @ResponseBody
    @RouteMatch(method = RequestMethod.POST)
    public Message getAreas() {
        return new Message(true, new ReturnData("areaList", areaService.getAreas()));
    }
}
