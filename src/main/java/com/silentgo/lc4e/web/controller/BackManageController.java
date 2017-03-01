package com.silentgo.lc4e.web.controller;

import com.silentgo.core.route.annotation.Controller;
import com.silentgo.core.route.annotation.Route;

/**
 * Project : lc4e
 * Package : com.silentgo.lc4e.web.controller
 *
 * @author <a href="mailto:teddyzhu15@gmail.com" target="_blank">teddyzhu</a>
 *         <p>
 *         Created by teddyzhu on 2017/2/16.
 */
@Controller
@Route("/manage")
public class BackManageController {
    @Route("/")
    public String index() {
        return "index.html";
    }
}
