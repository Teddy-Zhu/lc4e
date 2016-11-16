package com.silentgo.lc4e.web.controller;

import com.silentgo.core.aop.validator.annotation.RequestString;
import com.silentgo.core.route.annotation.Controller;
import com.silentgo.core.route.annotation.PathVariable;
import com.silentgo.core.route.annotation.Route;

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
}
