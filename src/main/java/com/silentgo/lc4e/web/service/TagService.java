package com.silentgo.lc4e.web.service;

import com.silentgo.core.cache.annotation.Cache;
import com.silentgo.core.ioc.annotation.Inject;
import com.silentgo.core.ioc.annotation.Service;
import com.silentgo.lc4e.config.Key;
import com.silentgo.lc4e.database.dao.TagDao;
import com.silentgo.lc4e.database.dao.VwUserTagsDao;
import com.silentgo.lc4e.database.model.Tag;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

/**
 * Project : lc4e
 * Package : com.silentgo.lc4e.web.service
 *
 * @author <a href="mailto:teddyzhu15@gmail.com" target="_blank">teddyzhu</a>
 *         <p>
 *         Created by teddyzhu on 2016/12/8.
 */
@Service
public class TagService {

    @Inject
    TagDao tagDao;

    @Inject
    VwUserTagsDao userTagsDao;

    @Inject
    ConfigService comVarService;

    @Cache(cacheName = Key.ComVar, key = "tags")
    public List<String> getTags() {
        List<Tag> tags = tagDao.queryAll();
        List<String> t = new ArrayList<>();
        for (Tag tag : tags) {
            t.add(tag.getTagName());
        }
        return t;
    }


    @Cache(cacheName = Key.ComVar, index = 0)
    public List<String> getUserTags(Long userId) {
        return userTagsDao.queryTagsWhereUserIdOrderByRankDescLimit(userId, 0, 5);
    }

    @Cache(cacheName = Key.ComVar, key = "blockedTags")
    public List<String> getBlockedTags() {
        String blockedTags = comVarService.getComVarValueByName("TagBlocked");
        return Arrays.asList(blockedTags.split(","));
    }

    public boolean addTags(String[] tags) {

        List<String> accessTags = new ArrayList<>();
        List<String> existTags = getTags();
        List<String> blockedTags = getBlockedTags();
        for (String tag : tags) {
            if (!blockedTags.contains(tag) && !existTags.contains(tag))
                accessTags.add(tag);
        }
        if (accessTags.size() > 0) {
            List<Tag> insertTags = new ArrayList<>();
            for (String accessTag : accessTags) {
                Tag tag = new Tag();
                tag.setTagName(accessTag);
                tag.setCreateTime(new Date());
                insertTags.add(tag);
            }
            return tagDao.insertByRows(insertTags) == insertTags.size();
        }
        return false;
    }
}
