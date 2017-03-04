package com.silentgo.lc4e.web.service;

import com.silentgo.core.SilentGo;
import com.silentgo.core.config.SilentGoConfig;
import com.silentgo.core.ioc.annotation.Inject;
import com.silentgo.core.ioc.annotation.Service;
import com.silentgo.lc4e.database.model.User;
import org.apache.shiro.SecurityUtils;
import org.apache.shiro.subject.Subject;

/**
 * Created by teddy on 2015/9/23.
 */
@Service
public class CurUserService {

    @Inject
    SilentGoConfig config;

    public String getSessionId() {
        Subject user = SecurityUtils.getSubject();
        if (user == null) {
            return null;
        }
        return user.getSession().getId().toString();
    }

    public User getCurrentUser() {
        Subject user = SecurityUtils.getSubject();
        if (user == null) {
            return null;
        }

        User curUser = (User) config.getCacheManager().get("users", user.getSession().getId().toString());
        if (curUser == null) {
            if (!user.isAuthenticated() && user.isRemembered()) {
                curUser = ((UserService) config.getFactory(config.getBeanClass(), SilentGo.me()).getBean(UserService.class.getName()).getObject()).findUserFullInfo(user.getPrincipal().toString());
                config.getCacheManager().set("users", user.getSession().getId().toString(), curUser);
            } else {
                return null;
            }
        }

        return curUser;
    }

    public boolean isLogin() {
        Subject user = SecurityUtils.getSubject();
        return user != null && user.isAuthenticated();
    }
}
