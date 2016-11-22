package com.silentgo.lc4e.web.service;

import com.silentgo.core.ioc.annotation.Inject;
import com.silentgo.core.ioc.annotation.Service;
import com.silentgo.utils.Assert;
import org.hashids.Hashids;

/**
 * Project : lc4e
 * Package : com.silentgo.lc4e.web.service
 *
 * @author <a href="mailto:teddyzhu15@gmail.com" target="_blank">teddyzhu</a>
 *         <p>
 *         Created by teddyzhu on 2016/11/22.
 */
@Service
public class UrlGenerateService {

    @Inject
    ComVarService comVarService;

    public String getUrl(Long id) {
        String salt = comVarService.getComVarValueByName("TopicUrlSalt");
        Hashids hashids = new Hashids(salt, 4);
        return hashids.encode(id);

    }

    public Long getId(String url) {
        String salt = comVarService.getComVarValueByName("TopicUrlSalt");
        Hashids hashids = new Hashids(salt, 4);
        long[] ret = hashids.decode(url);
        Assert.isTrue(ret.length == 1, "url解析失败");
        return ret[0];
    }
}
