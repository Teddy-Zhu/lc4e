package com.silentgo.lc4e.database.model;

import java.math.BigDecimal;
import com.silentgo.orm.base.annotation.Table;
import com.silentgo.orm.base.annotation.Column;
import java.util.Date;
import com.silentgo.orm.base.TableModel;

@Table("vw_topic_detail")
public class VwTopicDetail extends TableModel {

	@Column
	public String title;

	@Column
	public String content;

	@Column(def = true)
	public String texts;

	@Column(def = true)
	public Long id;

	@Column
	public String url;

	@Column("create_time")
	public Date createTime;

	@Column(value = "update_time",nullable = true)
	public Date updateTime;

	@Column(value = "author_id",def = true,nullable = true)
	public Long authorId;

	@Column(value = "author_nick",nullable = true)
	public String authorNick;

	@Column("area_id")
	public Long areaId;

	@Column(value = "area_abbr",nullable = true)
	public String areaAbbr;

	@Column(value = "author_img",def = true,nullable = true)
	public String authorImg;

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

	@Column(value = "topic_rank",def = true)
	public BigDecimal topicRank;

	@Column(value = "cuser_id",def = true,nullable = true)
	public Long cuserId;

	@Column(value = "cuser_nick",nullable = true)
	public String cuserNick;

	@Column(value = "cuser_img",def = true,nullable = true)
	public String cuserImg;

	@Column(value = "cuser_time",nullable = true)
	public Date cuserTime;

	@Column(value = "author_rank",def = true,nullable = true)
	public BigDecimal authorRank;

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

	public Long getAuthorId() {
		return authorId;
	}

	public void setAuthorId(Long authorId) {
		this.authorId = authorId;
	}

	public String getAuthorNick() {
		return authorNick;
	}

	public void setAuthorNick(String authorNick) {
		this.authorNick = authorNick;
	}

	public Long getAreaId() {
		return areaId;
	}

	public void setAreaId(Long areaId) {
		this.areaId = areaId;
	}

	public String getAreaAbbr() {
		return areaAbbr;
	}

	public void setAreaAbbr(String areaAbbr) {
		this.areaAbbr = areaAbbr;
	}

	public String getAuthorImg() {
		return authorImg;
	}

	public void setAuthorImg(String authorImg) {
		this.authorImg = authorImg;
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

	public BigDecimal getTopicRank() {
		return topicRank;
	}

	public void setTopicRank(BigDecimal topicRank) {
		this.topicRank = topicRank;
	}

	public Long getCuserId() {
		return cuserId;
	}

	public void setCuserId(Long cuserId) {
		this.cuserId = cuserId;
	}

	public String getCuserNick() {
		return cuserNick;
	}

	public void setCuserNick(String cuserNick) {
		this.cuserNick = cuserNick;
	}

	public String getCuserImg() {
		return cuserImg;
	}

	public void setCuserImg(String cuserImg) {
		this.cuserImg = cuserImg;
	}

	public Date getCuserTime() {
		return cuserTime;
	}

	public void setCuserTime(Date cuserTime) {
		this.cuserTime = cuserTime;
	}

	public BigDecimal getAuthorRank() {
		return authorRank;
	}

	public void setAuthorRank(BigDecimal authorRank) {
		this.authorRank = authorRank;
	}


}

