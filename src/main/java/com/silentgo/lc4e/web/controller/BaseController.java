package com.silentgo.lc4e.web.controller;

import com.silentgo.core.ioc.annotation.Inject;
import com.silentgo.core.route.annotation.Controller;
import com.silentgo.core.route.annotation.ResponseBody;
import com.silentgo.core.route.annotation.Route;
import com.silentgo.core.route.annotation.RouteMatch;
import com.silentgo.json.JSON;
import com.silentgo.lc4e.entity.MenuEntity;
import com.silentgo.lc4e.entity.Message;
import com.silentgo.lc4e.entity.ReturnData;
import com.silentgo.lc4e.tool.TemplateTool;
import com.silentgo.lc4e.web.service.AreaService;
import com.silentgo.lc4e.web.service.ConfigService;
import com.silentgo.lc4e.web.service.MenuService;
import com.silentgo.servlet.http.RequestMethod;

import java.util.List;

/**
 * Project : lc4e
 * Package : com.silentgo.lc4e.web.controller
 *
 * @author <a href="mailto:teddyzhu15@gmail.com" target="_blank">teddyzhu</a>
 *         <p>
 *         Created by teddyzhu on 2016/11/16.
 */
@Route("/base")
@Controller
public class BaseController {

    @Inject
    AreaService areaService;

    @Inject
    ConfigService comVarService;
    @Inject
    MenuService menuService;

    @Route("/area")
    @ResponseBody
    @RouteMatch(method = RequestMethod.POST)
    public Message getAreas() {
        return new Message(true, new ReturnData("areaList", areaService.getAreas()));
    }

    @Route("/baseInfo")
    @ResponseBody
    @RouteMatch(method = RequestMethod.POST)
    public Message getBaseData() {

        Message message = new Message(true);

        message.getData().put("SiteName", comVarService.getComVarValueByName("SiteName"));
        message.getData().put("version", comVarService.getComVarValueByName("Version"));
        List<MenuEntity> menuEntities = menuService.getMenuTree();
        message.getData().put("menusString", JSON.toJSONString(menuEntities));
        message.getData().put("userImg", comVarService.getComVarValueByName("Avatar"));
        message.getData().put("user", TemplateTool.currentUser());

        return message;
    }
}
