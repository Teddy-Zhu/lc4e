package com.silentgo.lc4e.database.model;

import java.math.BigDecimal;
import com.silentgo.orm.base.annotation.Table;
import com.silentgo.orm.base.annotation.Column;
import java.util.Date;
import com.silentgo.orm.base.TableModel;

@Table(value = "user",  primaryKey = "id")
public class User extends TableModel {

	@Column(aic = true)
	public Long id;

	@Column
	public String name;

	@Column
	public String mail;

	@Column
	public String nick;

	@Column
	public String password;

	@Column
	public String passsalt;

	@Column(def = true)
	public String img;

	@Column(nullable = true)
	public Date birth;

	@Column(def = true,nullable = true)
	public String sign;

	@Column(def = true)
	public BigDecimal balance;

	@Column(def = true)
	public BigDecimal rank;

	@Column
	public String phone;

	@Column(def = true)
	public Boolean locked;

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

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getMail() {
		return mail;
	}

	public void setMail(String mail) {
		this.mail = mail;
	}

	public String getNick() {
		return nick;
	}

	public void setNick(String nick) {
		this.nick = nick;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public String getPasssalt() {
		return passsalt;
	}

	public void setPasssalt(String passsalt) {
		this.passsalt = passsalt;
	}

	public String getImg() {
		return img;
	}

	public void setImg(String img) {
		this.img = img;
	}

	public Date getBirth() {
		return birth;
	}

	public void setBirth(Date birth) {
		this.birth = birth;
	}

	public String getSign() {
		return sign;
	}

	public void setSign(String sign) {
		this.sign = sign;
	}

	public BigDecimal getBalance() {
		return balance;
	}

	public void setBalance(BigDecimal balance) {
		this.balance = balance;
	}

	public BigDecimal getRank() {
		return rank;
	}

	public void setRank(BigDecimal rank) {
		this.rank = rank;
	}

	public String getPhone() {
		return phone;
	}

	public void setPhone(String phone) {
		this.phone = phone;
	}

	public Boolean getLocked() {
		return locked;
	}

	public void setLocked(Boolean locked) {
		this.locked = locked;
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

