package com.silentgo.lc4e.web.controller;

import com.silentgo.core.aop.validator.annotation.RequestString;
import com.silentgo.core.ioc.annotation.Inject;
import com.silentgo.core.route.annotation.Controller;
import com.silentgo.core.route.annotation.PathVariable;
import com.silentgo.core.route.annotation.Route;
import com.silentgo.core.route.annotation.RouteMatch;
import com.silentgo.lc4e.database.model.User;
import com.silentgo.lc4e.entity.Message;
import com.silentgo.lc4e.entity.ReturnData;
import com.silentgo.lc4e.web.service.UserService;
import com.silentgo.servlet.http.RequestMethod;

/**
 * Project : lc4e
 * Package : com.silentgo.lc4e.web.controller
 *
 * @author <a href="mailto:teddyzhu15@gmail.com" target="_blank">teddyzhu</a>
 *         <p>
 *         Created by teddyzhu on 2016/11/15.
 */
@Controller
@Route("/i")
public class UserInfoController {

    @Inject
    UserService userService;

    /**
     * user infomation view
     *
     * @param username
     * @return
     */
    @Route("/{username}")
    public String user(@PathVariable @RequestString String username) {
        return "index.html";
    }

    @Route("/{username}")
    @RouteMatch(method = RequestMethod.POST)
    public Message userInfo(@PathVariable @RequestString String username) {

        User user = userService.findUserInfo(Long.valueOf(username));

        return new Message(true, new ReturnData("user", user));
    }
}
