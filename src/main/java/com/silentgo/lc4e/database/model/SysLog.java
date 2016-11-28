package com.silentgo.lc4e.database.model;

import com.silentgo.orm.base.annotation.Table;
import com.silentgo.orm.base.annotation.Column;
import java.util.Date;
import com.silentgo.orm.base.TableModel;

@Table(value = "sys_log",  primaryKey = "id")
public class SysLog extends TableModel {

	@Column(aic = true)
	public Long id;

	@Column("operate_type_id")
	public Long operateTypeId;

	@Column("user_id")
	public Long userId;

	@Column
	public String description;

	@Column
	public String ip;

	@Column
	public String agant;

	@Column("create_time")
	public Date createTime;

	@Column(value = "update_time",nullable = true)
	public Date updateTime;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Long getOperateTypeId() {
		return operateTypeId;
	}

	public void setOperateTypeId(Long operateTypeId) {
		this.operateTypeId = operateTypeId;
	}

	public Long getUserId() {
		return userId;
	}

	public void setUserId(Long userId) {
		this.userId = userId;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public String getIp() {
		return ip;
	}

	public void setIp(String ip) {
		this.ip = ip;
	}

	public String getAgant() {
		return agant;
	}

	public void setAgant(String agant) {
		this.agant = agant;
	}

	public Date getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Date createTime) {
		this.createTime = createTime;
	}

	public Date getUpdateTime() {
		return updateTime;
	}

	public void setUpdateTime(Date updateTime) {
		this.updateTime = updateTime;
	}


}

