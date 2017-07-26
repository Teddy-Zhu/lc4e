package com.silentgo.lc4e.web.request;

/**
 * Project : lc4e
 * Package : com.silentgo.lc4e.web.request
 *
 * @author <a href="mailto:teddyzhu15@gmail.com" target="_blank">teddyzhu</a>
 *         <p>
 *         Created by teddyzhu on 2017/7/5.
 */
public class TodayHotTopicSearch {

    private int size;
    private Long areaId;

    public int getSize() {
        return size;
    }

    public void setSize(int size) {
        this.size = size;
    }

    public Long getAreaId() {
        return areaId;
    }

    public void setAreaId(Long areaId) {
        this.areaId = areaId;
    }
}
