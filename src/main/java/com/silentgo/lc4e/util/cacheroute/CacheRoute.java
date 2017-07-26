package com.silentgo.lc4e.util.cacheroute;

import com.silentgo.core.action.ActionChain;
import com.silentgo.core.action.ActionParam;
import com.silentgo.core.action.annotation.Action;
import com.silentgo.servlet.http.HttpStatus;
import com.silentgo.servlet.http.Request;

import javax.servlet.http.Cookie;

/**
 * Project : lc4e
 * Package : com.silentgo.lc4e.util.cacheroute
 *
 * @author <a href="mailto:teddyzhu15@gmail.com" target="_blank">teddyzhu</a>
 *         <p>
 *         Created by teddyzhu on 2016/12/14.
 */
@Action
public class CacheRoute extends ActionChain {

    private static final long MAX_AGE = 2764800L;

    @Override
    public Integer priority() {
        return Integer.MAX_VALUE - 15;
    }

    @Override
    public void doAction(ActionParam param) throws Throwable {
        if (param.getRequestURL().endsWith(".js") || param.getRequestURL().endsWith(".css")) {
            long ims = param.getRequest().getDateHeader("If-Modified-Since");
            long now;
            now = System.currentTimeMillis();
            if (ims != -1 && ims + MAX_AGE > now) {
                param.getResponse().setStatus(HttpStatus.NOT_MODIFIED_304);
                return;
            }
            param.getResponse().setHeader("Cache-Control", "max-age=" + MAX_AGE);
            param.getResponse().addDateHeader("Expires", now + MAX_AGE * 1000);
            param.getResponse().addDateHeader("Last-Modified", now);

        }
        next(param);
    }

    private String getCookie(Request request, String name) {
        for (Cookie cookie : request.getCookies()) {
            if (name.equals(cookie.getName())) {
                return cookie.getValue();
            }
        }
        return "";
    }
}
