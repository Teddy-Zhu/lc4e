package com.silentgo.lc4e.entity;

/**
 * Project : lc4e
 * Package : com.silentgo.lc4e.entity
 *
 * @author <a href="mailto:teddyzhu15@gmail.com" target="_blank">teddyzhu</a>
 *         <p>
 *         Created by teddyzhu on 2016/10/24.
 */
public class UserRolePermission {

    private String name;

    private String roleAbbr;

    private String permissionAbbr;

    public UserRolePermission(String name, String roleAbbr, String permissionAbbr) {
        this.name = name;
        this.roleAbbr = roleAbbr;
        this.permissionAbbr = permissionAbbr;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getRoleAbbr() {
        return roleAbbr;
    }

    public void setRoleAbbr(String roleAbbr) {
        this.roleAbbr = roleAbbr;
    }

    public String getPermissionAbbr() {
        return permissionAbbr;
    }

    public void setPermissionAbbr(String permissionAbbr) {
        this.permissionAbbr = permissionAbbr;
    }
}
