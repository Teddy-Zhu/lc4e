package com.silentgo.lc4e.tool;


import com.silentgo.core.SilentGo;
import com.silentgo.lc4e.database.model.User;
import com.silentgo.utils.StringKit;
import org.apache.shiro.SecurityUtils;

import javax.security.auth.Subject;
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
        User curUser = null;
        if (user.isAuthenticated()) {
            curUser = (User) SilentGo.me().getConfig().getCacheManager().get("users", user.getSession().getId().toString());
        }
        if (curUser == null) return "";
        else {
            User tmp = new User();
            tmp.setId(curUser.getId());
            tmp.setNick(curUser.getNick());
            return SilentGo.me().getConfig().getJsonPaser().toJsonString(tmp);
        }
    }
}
