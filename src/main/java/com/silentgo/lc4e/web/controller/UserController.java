package com.silentgo.lc4e.web.controller;

import com.silentgo.core.ioc.annotation.Inject;
import com.silentgo.core.plugin.event.EventFactory;
import com.silentgo.core.route.annotation.*;
import com.silentgo.lc4e.database.model.SysConfig;
import com.silentgo.lc4e.database.model.User;
import com.silentgo.lc4e.entity.Message;
import com.silentgo.lc4e.entity.ReturnData;
import com.silentgo.lc4e.util.geetest.GeetestLib;
import com.silentgo.lc4e.web.request.GeetestRequest;
import com.silentgo.lc4e.web.request.UserLoginRequest;
import com.silentgo.lc4e.web.service.ConfigService;
import com.silentgo.lc4e.web.service.CurUserService;
import com.silentgo.lc4e.web.service.UserService;
import com.silentgo.servlet.http.Request;
import com.silentgo.servlet.http.RequestMethod;
import com.silentgo.servlet.http.Response;
import com.silentgo.utils.PropKit;
import org.apache.shiro.SecurityUtils;
import org.apache.shiro.authc.UsernamePasswordToken;
import org.apache.shiro.authz.annotation.RequiresGuest;
import org.apache.shiro.subject.Subject;

import java.io.IOException;

/**
 * Project : lc4e
 * Package : com.silentgo.lc4e.web.controller
 *
 * @author <a href="mailto:teddyzhu15@gmail.com" target="_blank">teddyzhu</a>
 *         <p>
 *         Created by teddyzhu on 2016/10/28.
 */
@Controller
@Route("/u")
public class UserController {

    @Inject
    UserService userService;

    @Inject
    ConfigService comVarService;

    @Inject
    EventFactory eventFactory;

    /**
     * log out
     *
     * @param response
     * @return
     * @throws IOException
     */
    @Route("/signout")
    @RouteMatch(method = RequestMethod.POST)
    @ResponseBody
    public Message SignOut(Response response) throws IOException {
        SecurityUtils.getSubject().logout();
        return new Message(true, "SignOut Successfully");
    }

    /**
     * visit logout
     *
     * @param response
     * @throws IOException
     */
    @Route("/signout")
    public void SignOut2(Response response) throws IOException {
        SecurityUtils.getSubject().logout();
        response.sendRedirect("/");
    }


    /**
     * sign initial data
     *
     * @return
     */
    @Route("/login")
    @RouteMatch(method = RequestMethod.POST)
    public Message SignIn(Request request) {
        ReturnData[] datas = {
                new ReturnData("Captcha",
                        Boolean.parseBoolean(comVarService.getComVarByName("Captcha").getValue()))};
        return new Message(true, datas);
    }


    /**
     * 用户注册
     *
     * @param response
     * @param request
     * @param user
     * @return
     * @throws Exception
     */
    @RouteMatch(method = RequestMethod.POST)
    @Route("/register")
    @RequiresGuest
    @ResponseBody
    public Message reg(Response response, Request request, @RequestBody User user, @RequestBody GeetestRequest geetestRequest) throws Exception {

        if (!Boolean.parseBoolean(comVarService.getComVarByName("Register").getValue())) {
            return new Message("register closed");
        }

        SysConfig captchaConfig = comVarService.getComVarByName("Captcha");
        boolean captchaValue = Boolean.parseBoolean(captchaConfig.getValue());

        if (captchaValue) {
            GeetestLib geetestLib = new GeetestLib(GeetestLib.getId(propKit), GeetestLib.getKey(propKit), true);

            boolean result = geetestLib.verify(request, geetestRequest);

            if (!result) {
                return new Message(captchaConfig.getError());
            }
        }

        userService.createUser(user);

        if (user.getId() != null) {
            return new Message(true, "register successfully");
        } else {
            return new Message("register failed");
        }

    }

    @Inject
    CurUserService curUserService;

    @Inject
    PropKit propKit;

    /**
     * 用户登陆
     *
     * @param loginRequest
     * @param request
     * @return
     */
    @RouteMatch(method = RequestMethod.POST)
    @Route("/signin")
    @ResponseBody
    public Message signin(@RequestBody UserLoginRequest loginRequest,

                          Request request) {

        SysConfig captchaConfig = comVarService.getComVarByName("Captcha");
        boolean captchaValue = Boolean.parseBoolean(captchaConfig.getValue());


        if (captchaValue) {
            GeetestLib geetestLib = new GeetestLib(GeetestLib.getId(propKit), GeetestLib.getKey(propKit), true);

            boolean result = geetestLib.verify(request, loginRequest);

            if (!result) {
                return new Message(captchaConfig.getError());
            }
        }
        Subject subject = SecurityUtils.getSubject();
        if (!subject.isAuthenticated()) {
            UsernamePasswordToken token = new UsernamePasswordToken(loginRequest.getName(), loginRequest.getPassword());
            token.setRememberMe(true);
            subject.login(token);
            if (!subject.isAuthenticated()) {
                return new Message("Login failed");
            }
        }
        User LoginUser = curUserService.getCurrentUser();
        User user = new User();
        user.setId(LoginUser.getId());
        user.setNick(LoginUser.getNick());
        return new Message(true, "Login Success", new ReturnData("user", user));
    }


}
