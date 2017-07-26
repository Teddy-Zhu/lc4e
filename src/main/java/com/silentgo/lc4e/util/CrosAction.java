package com.silentgo.lc4e.util;

import com.silentgo.core.action.ActionChain;
import com.silentgo.core.action.ActionParam;
import com.silentgo.core.action.annotation.Action;
import com.silentgo.core.ioc.annotation.Inject;
import com.silentgo.core.ioc.annotation.Lazy;
import com.silentgo.utils.PropKit;
import com.silentgo.utils.StringKit;

import javax.servlet.http.HttpServletResponse;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

/**
 * Project : lc4e
 * Package : com.silentgo.lc4e.util
 *
 * @author <a href="mailto:teddyzhu15@gmail.com" target="_blank">teddyzhu</a>
 *         <p>
 *         Created by teddyzhu on 2017/6/21.
 */
@Action
public class CrosAction extends ActionChain {
    @Override
    public Integer priority() {
        return super.priority() - 15;
    }


    private static String crosDomain;

    private static List<String> crosSupportMethods;


    private static String allowMethods;

    @Inject
    @Lazy
    PropKit propKit;

    @Override
    public void doAction(ActionParam actionParam) throws Throwable {
        if (crosDomain == null) {
            String cros = propKit.getValue("cros");
            crosDomain = cros == null ? "" : cros;
        }
        if (crosSupportMethods == null) {
            crosSupportMethods = new ArrayList<>();
            allowMethods = propKit.getValue("cros.methods");
            if (StringKit.isBlank(allowMethods)) {
                allowMethods = "POST, GET, OPTIONS, DELETE";
            }
            String[] methodArray = allowMethods.split("\\s*,\\s*|\\s+");
            Collections.addAll(crosSupportMethods, methodArray);
        }

        String origin = actionParam.getRequest().getHeader("origin");
        if (origin != null && crosDomain.contains(origin) && crosSupportMethods.contains(actionParam.getRequest().getMethod())) {
            actionParam.getResponse().setHeader("Access-Control-Allow-Origin", origin);
            actionParam.getResponse().setHeader("Access-Control-Allow-Methods", allowMethods);
            actionParam.getResponse().setHeader("Access-Control-Max-Age", "3600");
            actionParam.getResponse().setHeader("Access-Control-Allow-Headers", "x-requested-with,Authorization,content-type");

            actionParam.getResponse().setHeader("Access-Control-Allow-Credentials", "true");
            //for ie
            actionParam.getResponse().setHeader("P3P", "CP=CAO PSA OU");
        }

        if (actionParam.getRequest().getMethod().equals("OPTIONS")) {
            actionParam.getResponse().setStatus(HttpServletResponse.SC_OK);
            return;
        }
        next(actionParam);
    }
}
