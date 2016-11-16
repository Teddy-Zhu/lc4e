package com.silentgo.lc4e.web.service;

import com.silentgo.core.ioc.annotation.Service;
import com.silentgo.orm.model.Page;

/**
 * Project : lc4e
 * Package : com.silentgo.lc4e.web.service
 *
 * @author <a href="mailto:teddyzhu15@gmail.com" target="_blank">teddyzhu</a>
 *         <p>
 *         Created by teddyzhu on 2016/11/2.
 */
@Service
public class PageFilter {

    public void filterPage(Page result) {
        if (result.getPageNumber() < 1) {
            result.setPageNumber(1);
        }
        if (result.getPageSize() < 20) {
            result.setPageNumber(20);
        }
    }
}