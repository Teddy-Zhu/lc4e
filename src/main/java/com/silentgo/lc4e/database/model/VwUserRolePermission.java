package com.silentgo.lc4e.database.model;

import com.silentgo.orm.base.annotation.Table;
import com.silentgo.orm.base.annotation.Column;
import java.util.Date;
import com.silentgo.orm.base.TableModel;

@Table("vw_user_role_permission")
public class VwUserRolePermission extends TableModel {

	@Column(value = "role_abbr",nullable = true)
	public String roleAbbr;

	@Column(value = "permission_abbr",nullable = true)
	public String permissionAbbr;

	@Column("user_name")
	public String userName;

	@Column(value = "role_is_available",def = true,nullable = true)
	public Boolean roleIsAvailable;

	@Column(value = "permission_is_available",def = true,nullable = true)
	public Boolean permissionIsAvailable;

	@Column(value = "role_end_time",nullable = true)
	public Date roleEndTime;

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

	public String getUserName() {
		return userName;
	}

	public void setUserName(String userName) {
		this.userName = userName;
	}

	public Boolean getRoleIsAvailable() {
		return roleIsAvailable;
	}

	public void setRoleIsAvailable(Boolean roleIsAvailable) {
		this.roleIsAvailable = roleIsAvailable;
	}

	public Boolean getPermissionIsAvailable() {
		return permissionIsAvailable;
	}

	public void setPermissionIsAvailable(Boolean permissionIsAvailable) {
		this.permissionIsAvailable = permissionIsAvailable;
	}

	public Date getRoleEndTime() {
		return roleEndTime;
	}

	public void setRoleEndTime(Date roleEndTime) {
		this.roleEndTime = roleEndTime;
	}


}

