package com.silentgo.lc4e.database.model;

import com.silentgo.orm.base.annotation.Table;
import com.silentgo.orm.base.annotation.Column;
import java.util.Date;
import com.silentgo.orm.base.TableModel;

@Table(value="sys_job",  primaryKey = "id")
public class SysJob extends TableModel {

	@Column
	public Long id;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	@Column
	public String name;

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	@Column
	public Integer order;

	public Integer getOrder() {
		return order;
	}

	public void setOrder(Integer order) {
		this.order = order;
	}

	@Column
	public String cron;

	public String getCron() {
		return cron;
	}

	public void setCron(String cron) {
		this.cron = cron;
	}

	@Column("class_name")
	public String className;

	public String getClassName() {
		return className;
	}

	public void setClassName(String className) {
		this.className = className;
	}

	@Column
	public Boolean enable;

	public Boolean getEnable() {
		return enable;
	}

	public void setEnable(Boolean enable) {
		this.enable = enable;
	}

	@Column("create_time")
	public Date createTime;

	public Date getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Date createTime) {
		this.createTime = createTime;
	}

	@Column("update_time")
	public Date updateTime;

	public Date getUpdateTime() {
		return updateTime;
	}

	public void setUpdateTime(Date updateTime) {
		this.updateTime = updateTime;
	}


}

