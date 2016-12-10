package com.silentgo.lc4e.database.model;

import java.math.BigDecimal;
import com.silentgo.orm.base.annotation.Table;
import com.silentgo.orm.base.annotation.Column;
import com.silentgo.orm.base.TableModel;

@Table("vw_user_tags")
public class VwUserTags extends TableModel {

	@Column("user_id")
	public Long userId;

	@Column(value = "tag_name",nullable = true)
	public String tagName;

	@Column(def = true)
	public BigDecimal rank;

	public Long getUserId() {
		return userId;
	}

	public void setUserId(Long userId) {
		this.userId = userId;
	}

	public String getTagName() {
		return tagName;
	}

	public void setTagName(String tagName) {
		this.tagName = tagName;
	}

	public BigDecimal getRank() {
		return rank;
	}

	public void setRank(BigDecimal rank) {
		this.rank = rank;
	}


}

