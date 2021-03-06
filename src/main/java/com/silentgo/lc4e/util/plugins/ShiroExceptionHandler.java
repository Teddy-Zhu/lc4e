package com.silentgo.lc4e.util.plugins;

import com.silentgo.core.config.SilentGoConfig;
import com.silentgo.core.exception.annotaion.ExceptionHandler;
import com.silentgo.core.exception.support.IExceptionHandler;
import com.silentgo.core.ioc.annotation.Inject;
import com.silentgo.core.render.RenderModel;
import com.silentgo.core.render.support.JsonRender;
import com.silentgo.core.render.support.RenderFactory;
import com.silentgo.core.render.support.RenderType;
import com.silentgo.lc4e.entity.Message;
import com.silentgo.servlet.http.Request;
import com.silentgo.servlet.http.Response;
import org.apache.shiro.authc.AuthenticationException;
import org.apache.shiro.authz.UnauthenticatedException;

/**
 * Created by teddy on 2015/7/19.
 */
@ExceptionHandler({AuthenticationException.class, UnauthenticatedException.class})
public class ShiroExceptionHandler implements IExceptionHandler {

    @Inject
    RenderFactory renderFactory;
    @Inject
    SilentGoConfig config;

    @Override
    public RenderModel resolve(Response response, Request request, Exception ex) {
        Message error = new Message(ex.getMessage() == null ? ex.toString() : ex.getMessage());

        if (UnauthenticatedException.class.equals(ex.getClass())) {
            error.setMessage("未登录");
        } else if (AuthenticationException.class.equals(ex.getClass())) {
            error.setMessage("登录失败");
        }
        if ("XMLHttpRequest".equals(request.getHeader("X-Requested-With"))) {
            return new RenderModel(new JsonRender(), error, request, response);
        } else {
            request.setAttribute("message", error);
            return new RenderModel(renderFactory.getRender(RenderType.View), "/pages/exception", request, response);
        }
    }
}
