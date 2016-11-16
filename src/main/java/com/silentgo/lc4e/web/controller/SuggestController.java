package com.silentgo.lc4e.web.controller;


import com.silentgo.core.ioc.annotation.Inject;
import com.silentgo.core.route.annotation.Controller;
import com.silentgo.core.route.annotation.RequestParam;
import com.silentgo.core.route.annotation.ResponseBody;
import com.silentgo.core.route.annotation.Route;
import com.silentgo.lc4e.database.model.User;
import com.silentgo.lc4e.entity.Message;
import com.silentgo.lc4e.web.service.UserService;
import com.silentgo.utils.StringKit;

/**
 * Created by teddy on 2015/8/27.
 */
@Controller
@Route("/su")
public class SuggestController {

    @Inject
    UserService userService;

    @Route
    @ResponseBody
    public Message name(@RequestParam String name) {
        boolean exist = true;
        if (StringKit.isNotBlank(name)) {
            exist = userService.validateUserName(name);
        }
        return new Message(!exist, exist ? "UserName Has been occupied" : "");
    }

    @Route
    @ResponseBody
    public Message nick(@RequestParam String nick) {
        boolean exist = true;
        if (StringKit.isNotBlank(nick)) {
            exist = userService.validateUserNick(nick);
        }
        return new Message(!exist, exist ? "UserNick Has been occupied" : "");
    }

    @Route
    @ResponseBody
    public Message mail(@RequestParam String mail) {
        boolean exist = true;
        if (StringKit.isNotBlank(mail)) {
            exist = userService.validateUserMail(mail);
        }
        return new Message(!exist, exist ? "UserMail Has been occupied" : "");
    }
}
