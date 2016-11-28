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
        return new Message(!exist, exist ? "用户名已被使用" : "");
    }

    @Route
    @ResponseBody
    public Message nick(@RequestParam("name") String nick) {
        boolean exist = true;
        if (StringKit.isNotBlank(nick)) {
            exist = userService.validateUserNick(nick);
        }
        return new Message(!exist, exist ? "用户昵称已被使用" : "");
    }

    @Route
    @ResponseBody
    public Message mail(@RequestParam("name") String mail) {
        boolean exist = true;
        if (StringKit.isNotBlank(mail)) {
            exist = userService.validateUserMail(mail);
        }
        return new Message(!exist, exist ? "用户邮箱已被使用" : "");
    }
}
