package com.silentgo.lc4e.database.model;

import com.silentgo.orm.base.annotation.Table;
import com.silentgo.orm.base.annotation.Column;
import java.util.Date;
import com.silentgo.orm.base.TableModel;

@Table("vw_topic_detail")
public class VwTopicDetail extends TableModel {

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

	@Column(def = true)
	public String texts;

	public String getTexts() {
		return texts;
	}

	public void setTexts(String texts) {
		this.texts = texts;
	}

	@Column(def = true)
	public Long id;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	@Column
	public String url;

	public String getUrl() {
		return url;
	}

	public void setUrl(String url) {
		this.url = url;
	}

	@Column("create_time")
	public Date createTime;

	public Date getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Date createTime) {
		this.createTime = createTime;
	}

	@Column(value= "update_time",nullable = true)
	public Date updateTime;

	public Date getUpdateTime() {
		return updateTime;
	}

	public void setUpdateTime(Date updateTime) {
		this.updateTime = updateTime;
	}

	@Column(value= "author_id",def = true,nullable = true)
	public Long authorId;

	public Long getAuthorId() {
		return authorId;
	}

	public void setAuthorId(Long authorId) {
		this.authorId = authorId;
	}

	@Column(value= "author_nick",nullable = true)
	public String authorNick;

	public String getAuthorNick() {
		return authorNick;
	}

	public void setAuthorNick(String authorNick) {
		this.authorNick = authorNick;
	}

	@Column(value= "author_mail",nullable = true)
	public String authorMail;

	public String getAuthorMail() {
		return authorMail;
	}

	public void setAuthorMail(String authorMail) {
		this.authorMail = authorMail;
	}

	@Column("area_id")
	public Long areaId;

	public Long getAreaId() {
		return areaId;
	}

	public void setAreaId(Long areaId) {
		this.areaId = areaId;
	}

	@Column(value= "view_count",nullable = true)
	public Integer viewCount;

	public Integer getViewCount() {
		return viewCount;
	}

	public void setViewCount(Integer viewCount) {
		this.viewCount = viewCount;
	}

	@Column(value= "comment_count",nullable = true)
	public Integer commentCount;

	public Integer getCommentCount() {
		return commentCount;
	}

	public void setCommentCount(Integer commentCount) {
		this.commentCount = commentCount;
	}

	@Column(nullable = true)
	public String tags;

	public String getTags() {
		return tags;
	}

	public void setTags(String tags) {
		this.tags = tags;
	}

	@Column(value= "area_abbr",nullable = true)
	public String areaAbbr;

	public String getAreaAbbr() {
		return areaAbbr;
	}

	public void setAreaAbbr(String areaAbbr) {
		this.areaAbbr = areaAbbr;
	}


}

