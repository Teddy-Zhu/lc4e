package com.silentgo.lc4e.database.model;

import com.silentgo.orm.base.annotation.Table;
import com.silentgo.orm.base.annotation.Column;
import java.util.Date;
import com.silentgo.orm.base.TableModel;

@Table(value = "sys_config",  primaryKey = "id")
public class SysConfig extends TableModel {

	@Column(aic = true)
	public Long id;

	@Column
	public String name;

	@Column(def = true)
	public String value;

	@Column("group_id")
	public Long groupId;

	@Column("group_name")
	public String groupName;

	@Column(nullable = true)
	public String error;

	@Column(nullable = true)
	public String description;

	@Column("create_time")
	public Date createTime;

	@Column(value = "update_ime",nullable = true)
	public Date updateIme;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getValue() {
		return value;
	}

	public void setValue(String value) {
		this.value = value;
	}

	public Long getGroupId() {
		return groupId;
	}

	public void setGroupId(Long groupId) {
		this.groupId = groupId;
	}

	public String getGroupName() {
		return groupName;
	}

	public void setGroupName(String groupName) {
		this.groupName = groupName;
	}

	public String getError() {
		return error;
	}

	public void setError(String error) {
		this.error = error;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public Date getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Date createTime) {
		this.createTime = createTime;
	}

	public Date getUpdateIme() {
		return updateIme;
	}

	public void setUpdateIme(Date updateIme) {
		this.updateIme = updateIme;
	}


}

