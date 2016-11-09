package com.silentgo.lc4e.web.controller;

import com.silentgo.core.aop.validator.annotation.RequestBool;
import com.silentgo.core.aop.validator.annotation.RequestString;
import com.silentgo.core.ioc.annotation.Inject;
import com.silentgo.core.plugin.event.EventFactory;
import com.silentgo.core.plugin.event.EventTool;
import com.silentgo.core.route.annotation.*;
import com.silentgo.lc4e.database.model.SysConfig;
import com.silentgo.lc4e.database.model.User;
import com.silentgo.lc4e.entity.Message;
import com.silentgo.lc4e.entity.ReturnData;
import com.silentgo.lc4e.tool.Lc4eCaptchaRender;
import com.silentgo.lc4e.web.event.UserRegisterEvent;
import com.silentgo.lc4e.web.service.ComVarService;
import com.silentgo.lc4e.web.service.UserService;
import com.silentgo.servlet.http.Request;
import com.silentgo.servlet.http.RequestMethod;
import com.silentgo.servlet.http.Response;
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
    ComVarService comVarService;

    @Inject
    EventFactory eventFactory;

    /**
     * log out
     *
     * @param response
     * @return
     * @throws IOException
     */
    @Route("/logout")
    @RouteMatch(method = RequestMethod.POST)
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
    @Route("/logout")
    public void SignOut2(Response response) throws IOException {
        SecurityUtils.getSubject().logout();
        response.sendRedirect("/");
    }


    /**
     * sign view
     *
     * @param response
     * @return
     */
    @RequiresGuest
    @Route("/login")
    public String SignIn(Response response) {
        return "index.html";
    }

    /**
     * sign initial data
     *
     * @return
     */
    @RequiresGuest
    @Route("/login")
    @RouteMatch(method = RequestMethod.POST)
    public Message SignIn(Request request) {
        ReturnData[] datas = {
                new ReturnData("Captcha",
                        Boolean.parseBoolean(comVarService.getComVarByName("Captcha").getValue()))};
        return new Message(true, datas);
    }

    /**
     * view
     *
     * @param response
     * @param request
     * @return
     * @throws Exception
     */
    @Route("/register")
    public String register(Response response, Request request) throws Exception {
        request.setAttribute("enable", Boolean.parseBoolean(comVarService.getComVarByName("Register").getValue()));
        return "index.html";
    }

    /**
     * 用户注册
     * @param response
     * @param request
     * @param user
     * @return
     * @throws Exception
     */
    @RouteMatch(method = RequestMethod.POST)
    @Route("/register")
    @ResponseBody
    public Message reg(Response response, Request request, @RequestParam("user") User user) throws Exception {

        if (!Boolean.parseBoolean(comVarService.getComVarByName("Register").getValue())) {
            return new Message("register closed");
        }
        userService.createUser(user);

        //event notify
        eventFactory.emit(new UserRegisterEvent(user));
        if (user.getId() != null) {
            return new Message(true, "register successfully");
        } else {
            return new Message("register failed");
        }

    }


    /**
     * 用户登陆
     * @param user
     * @param captcha
     * @param request
     * @param rememberMe
     * @return
     */
    @RouteMatch(method = RequestMethod.POST)
    @Route("/signin")
    @ResponseBody
    public Message signin(@RequestParam("user") User user,
                          @RequestString(defaultValue = "@@@@", range = {4, 4}) String captcha,
                          Request request,
                          @RequestBool Boolean rememberMe) {

        SysConfig captchaComVar = comVarService.getComVarByName("Captcha");
        String captchaValue = captchaComVar == null ? null : captchaComVar.getValue();
        if (captchaValue != null && Boolean.parseBoolean(captchaValue) && !Lc4eCaptchaRender.validate(request, captcha)) {
            return new Message(captchaComVar.getError());
        }
        Subject subject = SecurityUtils.getSubject();
        if (!subject.isAuthenticated()) {
            UsernamePasswordToken token = new UsernamePasswordToken(user.getName(), user.getPassword());
            token.setRememberMe(rememberMe);
            subject.login(token);
            subject.getSession().removeAttribute(Lc4eCaptchaRender.captcha_code);
            if (!subject.isAuthenticated()) {
                return new Message("Login failed");
            }
        }
        return new Message(true, "Login Success");
    }


    /**
     * user infomation view
     * @param username
     * @return
     */
    @Route("/i/{username}")
    public String user(@PathVariable @RequestString String username) {
        return "index.html";
    }

}
