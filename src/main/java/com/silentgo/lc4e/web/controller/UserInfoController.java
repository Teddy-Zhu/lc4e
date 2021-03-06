package com.silentgo.lc4e.web.controller;

import com.silentgo.core.ioc.annotation.Inject;
import com.silentgo.core.route.annotation.*;
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

    @Route("/{username}")
    @RouteMatch(method = RequestMethod.POST)
    @ResponseBody
    public Message userInfo(@PathVariable("username") String username) {

        User user = userService.findUserInfo(Long.valueOf(username));

        return new Message(true, new ReturnData("user", user));
    }
}
