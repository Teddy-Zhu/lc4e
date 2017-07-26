package com.silentgo.lc4e.web.request;

import java.util.Date;

/**
 * Project : lc4e
 * Package : com.silentgo.lc4e.web.request
 *
 * @author <a href="mailto:teddyzhu15@gmail.com" target="_blank">teddyzhu</a>
 *         <p>
 *         Created by teddyzhu on 2017/5/8.
 */
public class SystemConfigGroupSearch extends Pager {

    public Long id;

    public String abbr;

    public String name;
    public Date createTime;
    public Date updateIme;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getAbbr() {
        return abbr;
    }

    public void setAbbr(String abbr) {
        this.abbr = abbr;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Date getCreateTime() {
        return createTime;
    }

    public void setCreateTime(Date createTime) {
        this.createTime = createTime;
    }

    public Date getUpdateIme() {
        return updateIme;
    }

    public void setUpdateIme(Date updateIme) {
        this.updateIme = updateIme;
    }
}
