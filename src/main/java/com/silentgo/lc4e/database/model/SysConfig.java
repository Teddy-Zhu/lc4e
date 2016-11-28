package com.silentgo.lc4e.database.model;

import com.silentgo.orm.base.annotation.Table;
import com.silentgo.orm.base.annotation.Column;
import java.util.Date;
import com.silentgo.orm.base.TableModel;

@Table(value = "sys_config",  primaryKey = "id")
public class SysConfig extends TableModel {

	@Column
	public Long id;

	@Column
	public String name;

	@Column
	public String value;

	@Column(nullable = true)
	public String error;

	@Column
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

