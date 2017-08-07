package com.silentgo.lc4e.web.service;

import com.silentgo.core.cache.CacheManager;
import com.silentgo.core.cache.annotation.Cache;
import com.silentgo.core.config.SilentGoConfig;
import com.silentgo.core.db.intercept.Transaction;
import com.silentgo.core.ioc.annotation.Inject;
import com.silentgo.core.ioc.annotation.Service;
import com.silentgo.lc4e.config.Key;
import com.silentgo.lc4e.database.dao.SysConfigDao;
import com.silentgo.lc4e.database.dao.SysConfigGroupDao;
import com.silentgo.lc4e.database.model.SysConfig;
import com.silentgo.lc4e.database.model.SysConfigGroup;
import com.silentgo.lc4e.web.request.SystemConfigGroupSearch;
import com.silentgo.lc4e.web.request.SystemConfigSearch;
import com.silentgo.orm.base.SQLTool;
import com.silentgo.orm.model.Page;
import com.silentgo.utils.Assert;
import com.silentgo.utils.CollectionKit;
import com.silentgo.utils.ReflectKit;
import com.silentgo.utils.log.Log;
import com.silentgo.utils.log.LogFactory;

import java.util.*;

/**
 * Created by teddy on 2015/7/29.
 */
@Service
public class ConfigService {

    private static final Log LOGGER = LogFactory.get(ConfigService.class);

    @Inject
    SysConfigDao sysConfigDao;


    @Inject
    CacheManager cacheManager;

    @Inject
    SysConfigGroupDao sysConfigGroupDao;


    @Cache(cacheName = Key.ComVar, index = 0)
    public SysConfig getComVarByName(String name) {

        return sysConfigDao.queryOneWhereName(name);
    }

    public boolean clearConfigCache(String name) {
        return cacheManager.evict(Key.ComVar, name);
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

    /**
     * 查询所有配置组
     *
     * @return
     */
    public List<SysConfigGroup> queryAllConfigGroup() {
        return sysConfigGroupDao.queryAll();
    }

    /**
     * 查询指定配置
     *
     * @param search
     * @return
     */
    public Page<SysConfigGroup> queryConfigGroupBySearchParam(SystemConfigGroupSearch search) {

        Map<String, Object> map = ReflectKit.beanToMap(search);

        int count = sysConfigGroupDao.countByModelMap(map);

        map.put("limitBy", search.getStartRow() + "," + search.getPageSize());
        map.put("orderBy", "create_time desc");

        List<SysConfigGroup> configs = sysConfigGroupDao.queryByModelMap(map);

        Page<SysConfigGroup> result = new Page<>(search.getPageNum(), search.getPageSize());
        result.setTotalCount(count);
        result.setResult(configs);
        return result;
    }

    /**
     * 分页查询配置
     *
     * @param search
     * @return
     */
    public Page<SysConfig> queryConfigBySearchParam(SystemConfigSearch search) {

        Map<String, Object> map = ReflectKit.beanToMap(search);

        int count = sysConfigDao.countByModelMap(map);

        map.put("limitBy", search.getStartRow() + "," + search.getPageSize());
        map.put("orderBy", "create_time desc");

        List<SysConfig> configs = sysConfigDao.queryByModelMap(map);

        Page<SysConfig> result = new Page<>(search.getPageNum(), search.getPageSize());
        result.setTotalCount(count);
        result.setResult(configs);
        return result;
    }

    /**
     * 新增配置组
     *
     * @param sysConfigGroup
     * @return
     */
    public boolean createConfigGroup(SysConfigGroup sysConfigGroup) {
        Assert.isNotNull(sysConfigGroup, "参数非法");
        Assert.isNotBlank(sysConfigGroup.getAbbr(), "参数非法");

        Assert.isNotBlank(sysConfigGroup.getName(), "参数非法");

        SysConfigGroup uniqueQuery = new SysConfigGroup();
        uniqueQuery.setAbbr(sysConfigGroup.getAbbr());
        Map<String, Object> map = ReflectKit.beanToMap(uniqueQuery);

        int count = sysConfigGroupDao.countByModelMap(map);
        Assert.isTrue(count == 0, "该配置组已存在");

        sysConfigGroup.setId(null);
        sysConfigGroup.setCreateTime(new Date());
        sysConfigGroup.setUpdateIme(null);

        return sysConfigGroupDao.insertByRow(sysConfigGroup) == 1;
    }

    /**
     * 新增配置
     *
     * @param sysConfig
     * @return
     */
    public boolean createConfig(SysConfig sysConfig) {

        Assert.isNotNull(sysConfig, "参数非法");
        Assert.isNotNull(sysConfig.getGroupId(), "参数非法");
        Assert.isNotBlank(sysConfig.getName(), "参数非法");
        Assert.isNotBlank(sysConfig.getValue(), "参数非法");

        SysConfigGroup sysConfigGroup = sysConfigGroupDao.queryByPrimaryKey(sysConfig.getGroupId());

        Assert.isNotNull(sysConfigGroup, "配置组不存在");

        SysConfig uniqueQuery = new SysConfig();
        uniqueQuery.setGroupId(sysConfig.getGroupId());
        uniqueQuery.setName(sysConfig.getName());

        Map<String, Object> map = ReflectKit.beanToMap(uniqueQuery);
        int count = sysConfigDao.countByModelMap(map);

        Assert.isTrue(count == 0, "该配置已存在");

        sysConfig.setGroupName(sysConfigGroup.getName());
        sysConfig.setId(null);
        sysConfig.setCreateTime(new Date());
        sysConfig.setUpdateIme(null);

        return sysConfigDao.insertByRow(sysConfig) == 1;
    }

    @Inject
    SilentGoConfig config;

    /**
     * 编辑配置
     *
     * @param sysConfig
     * @return
     */
    public boolean editConfig(SysConfig sysConfig) {
        Assert.isNotNull(sysConfig, "参数非法");
        Assert.isNotNull(sysConfig.getId(), "参数非法");
        Assert.isNotNull(sysConfig.getGroupId(), "参数非法");
        Assert.isNotBlank(sysConfig.getName(), "参数非法");
        Assert.isNotBlank(sysConfig.getValue(), "参数非法");

        SysConfigGroup sysConfigGroup = sysConfigGroupDao.queryByPrimaryKey(sysConfig.getGroupId());

        Assert.isNotNull(sysConfigGroup, "配置组不存在");

        SysConfig uniqueQuery = new SysConfig();
        uniqueQuery.setGroupId(sysConfig.getGroupId());
        uniqueQuery.setName(sysConfig.getName());

        List<SysConfig> existList = sysConfigDao.queryByModelSelective(uniqueQuery);

        if (CollectionKit.isNotEmpty(existList)) {
            Assert.isTrue(existList.get(0).getId().equals(sysConfig.getId()), "该配置已存在");
        }

        sysConfig.setGroupName(sysConfigGroup.getName());
        sysConfig.setCreateTime(null);
        sysConfig.setUpdateIme(new Date());
        boolean ret = sysConfigDao.updateByPrimaryKeySelective(sysConfig) == 1;
        if (ret) {
            config.getCacheManager().evict(Key.ComVar, sysConfig.getName());
        }
        return ret;
    }

    /**
     * 编辑群组
     *
     * @param sysConfigGroup
     * @return
     */
    @Transaction
    public boolean editConfigGroup(SysConfigGroup sysConfigGroup) {
        Assert.isNotNull(sysConfigGroup, "参数非法");
        Assert.isNotNull(sysConfigGroup.getId(), "参数非法");
        Assert.isNotBlank(sysConfigGroup.getAbbr(), "参数非法");

        Assert.isNotBlank(sysConfigGroup.getName(), "参数非法");

        SysConfigGroup uniqueQuery = new SysConfigGroup();
        uniqueQuery.setAbbr(sysConfigGroup.getAbbr());

        List<SysConfigGroup> existList = sysConfigGroupDao.queryByModelSelective(uniqueQuery);

        if (CollectionKit.isNotEmpty(existList)) {
            Assert.isTrue(existList.get(0).getId().equals(sysConfigGroup.getId()), "该配置已存在");
        }


        sysConfigGroup.setCreateTime(null);
        sysConfigGroup.setUpdateIme(new Date());

        //同步config 表

        if (!existList.get(0).getName().equals(sysConfigGroup.getName())) {
            sysConfigDao.updateConfigGroupSetWhereGroupId(sysConfigGroup.getName(), sysConfigGroup.getId());
        }

        return sysConfigGroupDao.updateByPrimaryKeySelective(sysConfigGroup) == 1;

    }

    private static final List<Long> forbitList = new ArrayList<Long>() {{
        add(1L); // 系统组
        add(2L);//统计组
    }};

    /**
     * 删除配置组
     *
     * @param sysConfigGroup
     * @return
     */
    public boolean deleteConfigGroup(SysConfigGroup sysConfigGroup) {
        Assert.isNotNull(sysConfigGroup, "参数非法");
        Assert.isNotNull(sysConfigGroup.getId(), "参数非法");

        Assert.isTrue(!forbitList.contains(sysConfigGroup.getId()), "该配置组禁止删除");

        Map<String, Object> queryMap = new HashMap<>();
        queryMap.put("groupId", sysConfigGroup.getId());
        int count = sysConfigDao.countByModelMap(queryMap);

        Assert.isTrue(count == 0, "该配置组下存在配置,不能删除");

        return sysConfigGroupDao.deleteByPrimaryKey(sysConfigGroup.getId()) == 1;
    }

    /**
     * 删除配置
     *
     * @param sysConfig
     * @return
     */
    public boolean deleteConfig(SysConfig sysConfig) {
        Assert.isNotNull(sysConfig, "参数非法");
        Assert.isNotNull(sysConfig.getId(), "参数非法");

        SysConfig config = sysConfigDao.queryByPrimaryKey(sysConfig.getId());
        Assert.isNotNull(config, "配置不存在");
        Assert.isTrue(!forbitList.contains(config.getGroupId()), "该配置所在组不能删除配置");

        return sysConfigDao.deleteByPrimaryKey(sysConfig.getId()) == 1;
    }


    public boolean batchDeleteConfig(List<Long> ids) {

        Assert.isNotNull(ids, "参数非法");
        Assert.isTrue(CollectionKit.isNotEmpty(ids), "参数非法");


        List<SysConfig> configs = sysConfigDao.queryByPrimaryKeys(ids);

        for (SysConfig config : configs) {
            Assert.isTrue(!forbitList.contains(config.getGroupId()), "配置所在组不能删除配置");
        }

        return sysConfigDao.deleteByPrimaryKeys(ids) == ids.size();
    }

    public boolean batchDeleteConfigGroup(List<Long> ids) {
        Assert.isNotNull(ids, "参数非法");
        Assert.isTrue(CollectionKit.isNotEmpty(ids), "参数非法");

        for (Long id : ids) {
            Assert.isTrue(!forbitList.contains(id), "配置组禁止删除");
        }

        SQLTool sqlTool = new SQLTool();
        sqlTool.count("sys_config");
        sqlTool.where("group_id in (<#ids/>)");
        sqlTool.appendParam("ids", ids);

        int i = sysConfigDao.countCustom(sqlTool);
        Assert.isTrue(i == 0, "配置组下存在配置,不能删除");

        return sysConfigGroupDao.deleteByPrimaryKeys(ids) == ids.size();
    }
}
