package com.silentgo.lc4e.util.shiro;


import com.silentgo.core.SilentGo;
import com.silentgo.core.ioc.bean.BeanFactory;
import com.silentgo.lc4e.database.model.User;
import com.silentgo.lc4e.entity.UserRolePermission;
import com.silentgo.lc4e.web.service.CurUserService;
import com.silentgo.lc4e.web.service.UserService;
import org.apache.shiro.authc.*;
import org.apache.shiro.authz.AuthorizationInfo;
import org.apache.shiro.authz.SimpleAuthorizationInfo;
import org.apache.shiro.realm.AuthorizingRealm;
import org.apache.shiro.subject.PrincipalCollection;
import org.apache.shiro.util.ByteSource;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

public class UserRealm extends AuthorizingRealm {

    private BeanFactory getBeaFactory() {
        return me().getFactory(SilentGo.me().getConfig().getBeanClass());
    }

    private SilentGo me() {
        return SilentGo.me();
    }

    private <T> T getBeanObject(Class<T> clz) {
        return (T) getBeaFactory().getBean(clz.getName()).getObject();
    }

    @Override
    protected AuthorizationInfo doGetAuthorizationInfo(PrincipalCollection principals) {
        String username = (String) principals.getPrimaryPrincipal();

        SimpleAuthorizationInfo authorizationInfo = new SimpleAuthorizationInfo();
        List<UserRolePermission> user = getBeanObject(UserService.class).findUserRolesAndPermission(username);
        Set<String> roles = new HashSet<>(), permissions = new HashSet<>();
        user.forEach(u -> {
            roles.add(u.getRoleAbbr());
            permissions.add(u.getPermissionAbbr());
        });

        authorizationInfo.setRoles(roles);
        authorizationInfo.setStringPermissions(permissions);

        return authorizationInfo;
    }

    @Override
    protected AuthenticationInfo doGetAuthenticationInfo(AuthenticationToken token) throws AuthenticationException {

        String username = (String) token.getPrincipal();
        User user = getBeanObject(UserService.class).findUserFullInfo(username);

        if (user == null) {
            throw new UnknownAccountException();
        }

        if (user.getLocked()) {
            throw new LockedAccountException();
        }

        me().getConfig().getCacheManager().set("users", getBeanObject(CurUserService.class).getSessionId(), user);

        return new SimpleAuthenticationInfo(user.getName(), user.getPassword(), ByteSource.Util.bytes(user.getName() + user.getPasssalt()), getName());
    }

    @Override
    public void clearCachedAuthorizationInfo(PrincipalCollection principals) {
        super.clearCachedAuthorizationInfo(principals);
    }

    @Override
    public void clearCachedAuthenticationInfo(PrincipalCollection principals) {
        me().getConfig().getCacheManager().evict("users", getBeanObject(CurUserService.class).getSessionId());
        super.clearCachedAuthenticationInfo(principals);
    }

    @Override
    public void clearCache(PrincipalCollection principals) {
        me().getConfig().getCacheManager().evict("users", getBeanObject(CurUserService.class).getSessionId());
        super.clearCache(principals);
    }

    public void clearAllCachedAuthorizationInfo() {
        getAuthorizationCache().clear();
    }

    public void clearAllCachedAuthenticationInfo() {
        getAuthenticationCache().clear();
    }

    public void clearAllCache() {
        clearAllCachedAuthenticationInfo();
        clearAllCachedAuthorizationInfo();
    }

}
