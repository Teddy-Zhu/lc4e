package com.silentgo.lc4e.database.model;

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

	@Column(value = "view_count",nullable = true)
	public Integer viewCount;

	@Column(value = "comment_count",nullable = true)
	public Integer commentCount;

	@Column(nullable = true)
	public String tags;

	@Column(value = "area_abbr",nullable = true)
	public String areaAbbr;

	@Column(value = "author_img",def = true,nullable = true)
	public String authorImg;

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

	public Integer getViewCount() {
		return viewCount;
	}

	public void setViewCount(Integer viewCount) {
		this.viewCount = viewCount;
	}

	public Integer getCommentCount() {
		return commentCount;
	}

	public void setCommentCount(Integer commentCount) {
		this.commentCount = commentCount;
	}

	public String getTags() {
		return tags;
	}

	public void setTags(String tags) {
		this.tags = tags;
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


}

