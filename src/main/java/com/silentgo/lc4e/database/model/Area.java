package com.silentgo.lc4e.database.model;

import com.silentgo.orm.base.annotation.Table;
import com.silentgo.orm.base.annotation.Column;
import java.util.Date;
import com.silentgo.orm.base.TableModel;

@Table(value="area",  primaryKey = "id")
public class Area extends TableModel {

	@Column
	public Long id;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	@Column("parent_id")
	public Long parentId;

	public Long getParentId() {
		return parentId;
	}

	public void setParentId(Long parentId) {
		this.parentId = parentId;
	}

	@Column
	public String abbr;

	public String getAbbr() {
		return abbr;
	}

	public void setAbbr(String abbr) {
		this.abbr = abbr;
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
	public String description;

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	@Column
	public String css;

	public String getCss() {
		return css;
	}

	public void setCss(String css) {
		this.css = css;
	}

	@Column
	public String icon;

	public String getIcon() {
		return icon;
	}

	public void setIcon(String icon) {
		this.icon = icon;
	}

	@Column("is_publish")
	public Boolean isPublish;

	public Boolean getIsPublish() {
		return isPublish;
	}

	public void setIsPublish(Boolean isPublish) {
		this.isPublish = isPublish;
	}

	@Column("is_visible")
	public Boolean isVisible;

	public Boolean getIsVisible() {
		return isVisible;
	}

	public void setIsVisible(Boolean isVisible) {
		this.isVisible = isVisible;
	}

	@Column("is_close")
	public Boolean isClose;

	public Boolean getIsClose() {
		return isClose;
	}

	public void setIsClose(Boolean isClose) {
		this.isClose = isClose;
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

