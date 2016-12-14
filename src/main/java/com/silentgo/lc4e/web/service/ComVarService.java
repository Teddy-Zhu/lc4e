package com.silentgo.lc4e.web.service;

import com.silentgo.core.cache.annotation.Cache;
import com.silentgo.core.ioc.annotation.Inject;
import com.silentgo.core.ioc.annotation.Service;
import com.silentgo.lc4e.config.Key;
import com.silentgo.lc4e.database.dao.SysConfigDao;
import com.silentgo.lc4e.database.model.SysConfig;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Arrays;
import java.util.Collection;
import java.util.List;

/**
 * Created by teddy on 2015/7/29.
 */
@Service
public class ComVarService {

    private static final Logger LOGGER = LoggerFactory.getLogger(ComVarService.class);

    @Inject
    SysConfigDao sysConfigDao;

    @Cache(cacheName = Key.ComVar, index = 0)
    public SysConfig getComVarByName(String name) {

        return sysConfigDao.queryOneWhereName(name);
    }

    public SysConfig getComVarByNameNocache(String name) {
        return sysConfigDao.queryOneWhereName(name);
    }

    public List<SysConfig> getComVarsByNames(String[] name) {
        return sysConfigDao.queryListWhereName(Arrays.asList(name));
    }

    public List<SysConfig> getComVarsByNames(Collection<String> name) {
        return sysConfigDao.queryListWhereName(name);
    }

    public String getComVarValueByName(String name, boolean useCache) {
        LOGGER.debug("enter getComVarValueByName param:{}", name);
        SysConfig commonVariable = useCache ? getComVarByName(name) : getComVarByNameNocache(name);
        LOGGER.debug("exit getComVarValueByName result:{}", commonVariable);
        if (commonVariable != null) {
            return commonVariable.getValue();
        } else {
            return null;
        }
    }

    public String getComVarValueByName(String name) {
        LOGGER.debug("enter getComVarValueByName param:{}", name);
        SysConfig commonVariable = getComVarByName(name);
        LOGGER.debug("exit getComVarValueByName result:{}", commonVariable);
        if (commonVariable != null) {
            return commonVariable.getValue();
        } else {
            return null;
        }
    }
}
