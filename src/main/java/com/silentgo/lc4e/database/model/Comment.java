package com.silentgo.lc4e.database.model;

import com.silentgo.orm.base.annotation.Table;
import com.silentgo.orm.base.annotation.Column;
import java.util.Date;
import com.silentgo.orm.base.TableModel;

@Table(value = "comment",  primaryKey = "id")
public class Comment extends TableModel {

	@Column(aic = true)
	public Long id;

	@Column("user_id")
	public Long userId;

	@Column("topic_id")
	public Long topicId;

	@Column(value = "refer_user",def = true)
	public String referUser;

	@Column(value = "refer_floor",def = true)
	public String referFloor;

	@Column
	public String content;

	@Column("is_visible")
	public Boolean isVisible;

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

	public Long getUserId() {
		return userId;
	}

	public void setUserId(Long userId) {
		this.userId = userId;
	}

	public Long getTopicId() {
		return topicId;
	}

	public void setTopicId(Long topicId) {
		this.topicId = topicId;
	}

	public String getReferUser() {
		return referUser;
	}

	public void setReferUser(String referUser) {
		this.referUser = referUser;
	}

	public String getReferFloor() {
		return referFloor;
	}

	public void setReferFloor(String referFloor) {
		this.referFloor = referFloor;
	}

	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}

	public Boolean getIsVisible() {
		return isVisible;
	}

	public void setIsVisible(Boolean isVisible) {
		this.isVisible = isVisible;
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

