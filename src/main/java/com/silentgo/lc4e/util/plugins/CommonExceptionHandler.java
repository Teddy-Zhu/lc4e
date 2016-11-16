package com.silentgo.lc4e.util.plugins;

import com.silentgo.core.SilentGo;
import com.silentgo.core.config.SilentGoConfig;
import com.silentgo.core.exception.annotaion.ExceptionHandler;
import com.silentgo.core.exception.support.IExceptionHandler;
import com.silentgo.core.ioc.annotation.Inject;
import com.silentgo.core.render.RenderModel;
import com.silentgo.core.render.support.JsonRender;
import com.silentgo.core.render.support.JspRender;
import com.silentgo.lc4e.entity.Message;
import com.silentgo.servlet.http.Request;
import com.silentgo.servlet.http.Response;

/**
 * Project : SilentGo
 * Package : com.silentgo.lc4e.util.plugins
 *
 * @author <a href="mailto:teddyzhu15@gmail.com" target="_blank">teddyzhu</a>
 *         <p>
 *         Created by teddyzhu on 2016/10/13.
 */
@ExceptionHandler
public class CommonExceptionHandler implements IExceptionHandler {


    @Inject
    SilentGoConfig config;

    @Override
    public RenderModel resolve(Response response, Request request, Exception ex) {
        Message error = new Message(ex.getMessage() == null ? ex.toString() : ex.getMessage());
        if ("XMLHttpRequest".equals(request.getHeader("X-Requested-With"))) {
            return new RenderModel(new JsonRender(), error, request, response);
        } else {
            request.setAttribute("message", error);
            return new RenderModel(new JspRender(config.getBaseViewPath()), "/pages/exception", request, response);
        }
    }
}
