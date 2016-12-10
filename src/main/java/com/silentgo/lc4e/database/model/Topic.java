package com.silentgo.lc4e.database.model;

import java.math.BigDecimal;
import com.silentgo.orm.base.annotation.Table;
import com.silentgo.orm.base.annotation.Column;
import java.util.Date;
import com.silentgo.orm.base.TableModel;

@Table(value = "topic",  primaryKey = "id")
public class Topic extends TableModel {

	@Column(aic = true)
	public Long id;

	@Column
	public String url;

	@Column("user_id")
	public Long userId;

	@Column("area_id")
	public Long areaId;

	@Column
	public String title;

	@Column
	public String content;

	@Column(def = true)
	public String texts;

	@Column(value = "is_visible",def = true)
	public Boolean isVisible;

	@Column(value = "is_close",def = true)
	public Boolean isClose;

	@Column(value = "is_delete",def = true)
	public Boolean isDelete;

	@Column(value = "is_comment",def = true)
	public Boolean isComment;

	@Column(def = true,nullable = true)
	public String tags;

	@Column(def = true)
	public Integer top;

	@Column(def = true)
	public Integer down;

	@Column(value = "comment_count",def = true)
	public Integer commentCount;

	@Column(value = "view_count",def = true,nullable = true)
	public Integer viewCount;

	@Column(def = true)
	public BigDecimal rank;

	@Column(value = "last_comment_user_id",nullable = true)
	public Long lastCommentUserId;

	@Column(value = "last_comment_time",nullable = true)
	public Date lastCommentTime;

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

	public String getUrl() {
		return url;
	}

	public void setUrl(String url) {
		this.url = url;
	}

	public Long getUserId() {
		return userId;
	}

	public void setUserId(Long userId) {
		this.userId = userId;
	}

	public Long getAreaId() {
		return areaId;
	}

	public void setAreaId(Long areaId) {
		this.areaId = areaId;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}

	public String getTexts() {
		return texts;
	}

	public void setTexts(String texts) {
		this.texts = texts;
	}

	public Boolean getIsVisible() {
		return isVisible;
	}

	public void setIsVisible(Boolean isVisible) {
		this.isVisible = isVisible;
	}

	public Boolean getIsClose() {
		return isClose;
	}

	public void setIsClose(Boolean isClose) {
		this.isClose = isClose;
	}

	public Boolean getIsDelete() {
		return isDelete;
	}

	public void setIsDelete(Boolean isDelete) {
		this.isDelete = isDelete;
	}

	public Boolean getIsComment() {
		return isComment;
	}

	public void setIsComment(Boolean isComment) {
		this.isComment = isComment;
	}

	public String getTags() {
		return tags;
	}

	public void setTags(String tags) {
		this.tags = tags;
	}

	public Integer getTop() {
		return top;
	}

	public void setTop(Integer top) {
		this.top = top;
	}

	public Integer getDown() {
		return down;
	}

	public void setDown(Integer down) {
		this.down = down;
	}

	public Integer getCommentCount() {
		return commentCount;
	}

	public void setCommentCount(Integer commentCount) {
		this.commentCount = commentCount;
	}

	public Integer getViewCount() {
		return viewCount;
	}

	public void setViewCount(Integer viewCount) {
		this.viewCount = viewCount;
	}

	public BigDecimal getRank() {
		return rank;
	}

	public void setRank(BigDecimal rank) {
		this.rank = rank;
	}

	public Long getLastCommentUserId() {
		return lastCommentUserId;
	}

	public void setLastCommentUserId(Long lastCommentUserId) {
		this.lastCommentUserId = lastCommentUserId;
	}

	public Date getLastCommentTime() {
		return lastCommentTime;
	}

	public void setLastCommentTime(Date lastCommentTime) {
		this.lastCommentTime = lastCommentTime;
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

