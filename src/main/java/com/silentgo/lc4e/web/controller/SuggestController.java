package com.silentgo.lc4e.web.controller;


import com.silentgo.core.ioc.annotation.Inject;
import com.silentgo.core.route.annotation.*;
import com.silentgo.lc4e.entity.Message;
import com.silentgo.lc4e.web.request.UserPredictReq;
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
    public Message name(@RequestBody UserPredictReq req) {
        boolean exist = true;
        if (StringKit.isNotBlank(req.getName())) {
            exist = userService.validateUserName(req.getName());
        }
        return new Message(!exist, exist ? "用户名已被使用" : "");
    }

    @Route
    @ResponseBody
    public Message nick(@RequestBody UserPredictReq req) {
        boolean exist = true;
        if (StringKit.isNotBlank(req.getName())) {
            exist = userService.validateUserNick(req.getName());
        }
        return new Message(!exist, exist ? "用户昵称已被使用" : "");
    }

    @Route
    @ResponseBody
    public Message mail(@RequestBody UserPredictReq req) {
        boolean exist = true;
        if (StringKit.isNotBlank(req.getName())) {
            exist = userService.validateUserMail(req.getName());
        }
        return new Message(!exist, exist ? "用户邮箱已被使用" : "");
    }
}
