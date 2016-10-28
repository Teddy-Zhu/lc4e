package com.silentgo.lc4e.database.model;

import com.silentgo.orm.base.annotation.Table;
import com.silentgo.orm.base.annotation.Column;
import java.util.Date;
import com.silentgo.orm.base.TableModel;

@Table(value="topic",  primaryKey = "id")
public class Topic extends TableModel {

	@Column
	public Long id;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	@Column("user_id")
	public Long userId;

	public Long getUserId() {
		return userId;
	}

	public void setUserId(Long userId) {
		this.userId = userId;
	}

	@Column("area_id")
	public Long areaId;

	public Long getAreaId() {
		return areaId;
	}

	public void setAreaId(Long areaId) {
		this.areaId = areaId;
	}

	@Column
	public String title;

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	@Column
	public String content;

	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}

	@Column
	public String texts;

	public String getTexts() {
		return texts;
	}

	public void setTexts(String texts) {
		this.texts = texts;
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

	@Column("is_delete")
	public Boolean isDelete;

	public Boolean getIsDelete() {
		return isDelete;
	}

	public void setIsDelete(Boolean isDelete) {
		this.isDelete = isDelete;
	}

	@Column("is_comment")
	public Boolean isComment;

	public Boolean getIsComment() {
		return isComment;
	}

	public void setIsComment(Boolean isComment) {
		this.isComment = isComment;
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

