package com.silentgo.lc4e.database.model;

import com.silentgo.orm.base.annotation.Table;
import com.silentgo.orm.base.annotation.Column;
import java.util.Date;
import com.silentgo.orm.base.TableModel;

@Table("vw_user_permission")
public class VwUserPermission extends TableModel {

	@Column("user_name")
	public String userName;

	public String getUserName() {
		return userName;
	}

	public void setUserName(String userName) {
		this.userName = userName;
	}

	@Column(value= "permission_end_time",nullable = true)
	public Date permissionEndTime;

	public Date getPermissionEndTime() {
		return permissionEndTime;
	}

	public void setPermissionEndTime(Date permissionEndTime) {
		this.permissionEndTime = permissionEndTime;
	}

	@Column(value= "permission_abbr",nullable = true)
	public String permissionAbbr;

	public String getPermissionAbbr() {
		return permissionAbbr;
	}

	public void setPermissionAbbr(String permissionAbbr) {
		this.permissionAbbr = permissionAbbr;
	}

	@Column(value= "permission_is_available",def = true,nullable = true)
	public Boolean permissionIsAvailable;

	public Boolean getPermissionIsAvailable() {
		return permissionIsAvailable;
	}

	public void setPermissionIsAvailable(Boolean permissionIsAvailable) {
		this.permissionIsAvailable = permissionIsAvailable;
	}


}

