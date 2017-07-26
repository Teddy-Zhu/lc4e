package com.silentgo.lc4e.database.model;

import com.silentgo.orm.base.annotation.Table;
import com.silentgo.orm.base.annotation.Column;
import java.util.Date;
import com.silentgo.orm.base.TableModel;

@Table(value = "sys_config_group",  primaryKey = "id")
public class SysConfigGroup extends TableModel {

	@Column(aic = true)
	public Long id;

	@Column
	public String abbr;

	@Column
	public String name;

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

	public String getAbbr() {
		return abbr;
	}

	public void setAbbr(String abbr) {
		this.abbr = abbr;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
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

