package com.silentgo.lc4e.web.request;

/**
 * Project : lc4e
 * Package : com.silentgo.lc4e.web.request
 *
 * @author <a href="mailto:teddyzhu15@gmail.com" target="_blank">teddyzhu</a>
 *         <p>
 *         Created by teddyzhu on 2017/4/27.
 */
public class Pager {

    private Integer pageNum;
    private Integer pageSize;

    public Integer getStartRow() {
        return (getPageNum() - 1) * getPageSize();
    }

    public Integer getPageNum() {
        return pageNum == null ? 1 : pageNum;
    }

    public void setPageNum(Integer pageNum) {
        this.pageNum = pageNum == null || pageNum < 1 ? 1 : pageNum;
    }

    public Integer getPageSize() {
        return pageSize == null ? 20 : pageSize;
    }

    public void setPageSize(Integer pageSize) {
        this.pageSize = pageSize == null || pageSize < 0 ? 20 : pageSize;
    }
}
