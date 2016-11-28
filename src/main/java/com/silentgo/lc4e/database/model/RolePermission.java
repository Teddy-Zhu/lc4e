package com.silentgo.lc4e.database.model;

import com.silentgo.orm.base.annotation.Table;
import com.silentgo.orm.base.annotation.Column;
import java.util.Date;
import com.silentgo.orm.base.TableModel;

@Table(value = "role_permission",  primaryKey = "id")
public class RolePermission extends TableModel {

	@Column(aic = true)
	public Long id;

	@Column("role_id")
	public Long roleId;

	@Column("permission_id")
	public Long permissionId;

	@Column("create_time")
	public Date createTime;

	@Column("update_tine")
	public Date updateTine;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Long getRoleId() {
		return roleId;
	}

	public void setRoleId(Long roleId) {
		this.roleId = roleId;
	}

	public Long getPermissionId() {
		return permissionId;
	}

	public void setPermissionId(Long permissionId) {
		this.permissionId = permissionId;
	}

	public Date getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Date createTime) {
		this.createTime = createTime;
	}

	public Date getUpdateTine() {
		return updateTine;
	}

	public void setUpdateTine(Date updateTine) {
		this.updateTine = updateTine;
	}


}

