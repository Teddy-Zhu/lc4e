package com.silentgo.lc4e.web.controller;

import com.silentgo.core.ioc.annotation.Inject;
import com.silentgo.core.route.annotation.*;
import com.silentgo.lc4e.database.model.SysConfig;
import com.silentgo.lc4e.database.model.SysConfigGroup;
import com.silentgo.lc4e.entity.Message;
import com.silentgo.lc4e.web.request.SystemConfigGroupSearch;
import com.silentgo.lc4e.web.request.SystemConfigSearch;
import com.silentgo.lc4e.web.service.ConfigService;
import com.silentgo.servlet.http.RequestMethod;

import java.util.List;

/**
 * Project : lc4e
 * Package : com.silentgo.lc4e.web.controller
 *
 * @author <a href="mailto:teddyzhu15@gmail.com" target="_blank">teddyzhu</a>
 *         <p>
 *         Created by teddyzhu on 2017/7/6.
 */
@Controller
@Route("/manage")
public class ConfigController {
    @Inject
    ConfigService configService;

    @Route("/config/query")
    @RouteMatch(method = RequestMethod.POST)
    @ResponseBody
    public Message configQuery(@RequestBody SystemConfigSearch search) {
        return new Message("pageList", configService.queryConfigBySearchParam(search));
    }

    @Route("/config/group/queryAll")
    @RouteMatch(method = RequestMethod.POST)
    @ResponseBody
    public Message configGroupQueryAll() {
        return new Message("list", configService.queryAllConfigGroup());
    }

    @Route("/config/group/query")
    @RouteMatch(method = RequestMethod.POST)
    @ResponseBody
    public Message configGroupQuery(@RequestBody SystemConfigGroupSearch search) {
        return new Message("pageList", configService.queryConfigGroupBySearchParam(search));
    }

    @Route("/config/group/new")
    @ResponseBody
    @RouteMatch(method = RequestMethod.POST)
    public Message newGroup(@RequestBody SysConfigGroup sysConfigGroup) {
        return new Message(configService.createConfigGroup(sysConfigGroup));
    }

    @Route("/config/new")
    @ResponseBody
    @RouteMatch(method = RequestMethod.POST)
    public Message newConfig(@RequestBody SysConfig sysConfig) {
        return new Message(configService.createConfig(sysConfig));
    }

    @Route("/config/group/delete")
    @ResponseBody
    @RouteMatch(method = RequestMethod.POST)
    public Message deleteGroup(@RequestBody SysConfigGroup sysConfigGroup) {
        return new Message(configService.deleteConfigGroup(sysConfigGroup));
    }

    @Route("/config/delete")
    @ResponseBody
    @RouteMatch(method = RequestMethod.POST)
    public Message deleteConfig(@RequestBody SysConfig sysConfig) {
        return new Message(configService.deleteConfig(sysConfig));
    }

    @Route("/config/group/batchDelete")
    @ResponseBody
    @RouteMatch(method = RequestMethod.POST)
    public Message batchDeleteGroup(@RequestBody List<Long> ids) {
        return new Message(configService.batchDeleteConfigGroup(ids));
    }

    @Route("/config/batchDelete")
    @ResponseBody
    @RouteMatch(method = RequestMethod.POST)
    public Message batchDeleteConfig(@RequestBody List<Long> ids) {
        return new Message(configService.batchDeleteConfig(ids));
    }

    @Route("/config/group/edit")
    @ResponseBody
    @RouteMatch(method = RequestMethod.POST)
    public Message editGroup(@RequestBody SysConfigGroup sysConfigGroup) {
        return new Message(configService.editConfigGroup(sysConfigGroup));
    }

    @Route("/config/edit")
    @ResponseBody
    @RouteMatch(method = RequestMethod.POST)
    public Message editConfig(@RequestBody SysConfig sysConfig) {
        return new Message(configService.editConfig(sysConfig));
    }

}
