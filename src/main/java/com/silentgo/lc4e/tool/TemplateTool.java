package com.silentgo.lc4e.tool;


import com.silentgo.core.SilentGo;
import com.silentgo.lc4e.database.model.User;
import com.silentgo.lc4e.web.service.UserService;
import com.silentgo.utils.StringKit;
import org.apache.shiro.SecurityUtils;

import java.util.Date;
import java.util.List;

/**
 * Created by teddy on 2015/9/5.
 */
public class TemplateTool {
    public static Long getTime() {
        return System.currentTimeMillis();
    }

    public static String formatTime(Date date, Date now) {
        return RelativeDate.format(date, now);
    }

    public static boolean isEmpty(String string) {
        return StringKit.isBlank(string);
    }

    public static boolean isEmpty(List<String> string) {
        return string == null || string.size() == 0;
    }

    public static String currentUser() {
        org.apache.shiro.subject.Subject user = SecurityUtils.getSubject();
        if (user == null) {
            return null;
        }

        SilentGo me = SilentGo.me();

        User curUser = (User) me.getConfig().getCacheManager().get("users", user.getSession().getId().toString());
        if (curUser == null) {
            if (!user.isAuthenticated() && user.isRemembered()) {
                curUser = ((UserService) me.getFactory(me.getConfig().getBeanClass()).getBean(UserService.class.getName()).getObject()).findUserFullInfo(user.getPrincipal().toString());
                me.getConfig().getCacheManager().set("users", user.getSession().getId().toString(), curUser);
            } else {
                return "";
            }
        }
        User tmp = new User();
        tmp.setId(curUser.getId());
        tmp.setNick(curUser.getNick());
        return SilentGo.me().getConfig().getJsonPaser().toJsonString(tmp);

    }
}
