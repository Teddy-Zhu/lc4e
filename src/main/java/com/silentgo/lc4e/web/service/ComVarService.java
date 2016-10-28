package com.silentgo.lc4e.web.service;

import com.silentgo.core.cache.annotation.Cache;
import com.silentgo.core.ioc.annotation.Inject;
import com.silentgo.core.ioc.annotation.Service;
import com.silentgo.lc4e.config.Key;
import com.silentgo.lc4e.database.model.SysConfig;
import com.silentgo.lc4e.database.dao.SysConfigDao;

import java.util.Arrays;
import java.util.Collection;
import java.util.List;

/**
 * Created by teddy on 2015/7/29.
 */
@Service
public class ComVarService {

    @Inject
    SysConfigDao sysConfigDao;

    @Cache(cacheName = Key.ComVar, index = 0)
    public SysConfig getComVarByName(String name) {

        return sysConfigDao.queryOneByName(name);
    }

    public List<SysConfig> getComVarsByNames(String[] name) {
        return sysConfigDao.queryListByListName(Arrays.asList(name));
    }

    public List<SysConfig> getComVarsByNames(Collection<String> name) {
        return sysConfigDao.queryListByListName(name);
    }

    public String getComVarValueByName(String name) {
        SysConfig commonVariable = getComVarByName(name);
        if (commonVariable != null) {
            return commonVariable.getValue();
        } else {
            return null;
        }
    }
}
