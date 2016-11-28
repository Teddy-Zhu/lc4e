package com.silentgo.lc4e.database.model;

import com.silentgo.orm.base.annotation.Table;
import com.silentgo.orm.base.annotation.Column;
import java.util.Date;
import com.silentgo.orm.base.TableModel;

@Table("vw_user_permission")
public class VwUserPermission extends TableModel {

	@Column("user_name")
	public String userName;

	@Column(value = "permission_end_time",nullable = true)
	public Date permissionEndTime;

	@Column(value = "permission_abbr",nullable = true)
	public String permissionAbbr;

	@Column(value = "permission_is_available",def = true,nullable = true)
	public Boolean permissionIsAvailable;

	public String getUserName() {
		return userName;
	}

	public void setUserName(String userName) {
		this.userName = userName;
	}

	public Date getPermissionEndTime() {
		return permissionEndTime;
	}

	public void setPermissionEndTime(Date permissionEndTime) {
		this.permissionEndTime = permissionEndTime;
	}

	public String getPermissionAbbr() {
		return permissionAbbr;
	}

	public void setPermissionAbbr(String permissionAbbr) {
		this.permissionAbbr = permissionAbbr;
	}

	public Boolean getPermissionIsAvailable() {
		return permissionIsAvailable;
	}

	public void setPermissionIsAvailable(Boolean permissionIsAvailable) {
		this.permissionIsAvailable = permissionIsAvailable;
	}


}

