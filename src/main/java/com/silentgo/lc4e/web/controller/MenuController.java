package com.silentgo.lc4e.web.controller;

import com.silentgo.core.ioc.annotation.Inject;
import com.silentgo.core.route.annotation.Controller;
import com.silentgo.core.route.annotation.ResponseBody;
import com.silentgo.core.route.annotation.Route;
import com.silentgo.core.route.annotation.RouteMatch;
import com.silentgo.lc4e.entity.Message;
import com.silentgo.lc4e.entity.ReturnData;
import com.silentgo.lc4e.web.service.MenuService;
import com.silentgo.servlet.http.RequestMethod;

/**
 * Project : lc4e
 * Package : com.silentgo.lc4e.web.controller
 *
 * @author <a href="mailto:teddyzhu15@gmail.com" target="_blank">teddyzhu</a>
 *         <p>
 *         Created by teddyzhu on 2016/11/12.
 */
@Controller
@Route("/basic")
public class MenuController {
    @Inject
    MenuService menuService;

    @Route("/menu")
    @RouteMatch(method = RequestMethod.POST)
    @ResponseBody
    public Message getMenus() {
        return new Message(true, new ReturnData("menu", menuService.getMenuTree()));
    }
}
