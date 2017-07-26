package com.silentgo.lc4e.config;

import com.alibaba.druid.filter.Filter;
import com.alibaba.druid.filter.logging.LogFilter;
import com.alibaba.druid.filter.logging.Slf4jLogFilter;
import com.alibaba.druid.filter.stat.StatFilter;
import com.alibaba.druid.wall.WallFilter;
import com.silentgo.core.SilentGo;
import com.silentgo.core.cache.CacheManager;
import com.silentgo.core.config.SilentGoConfig;
import com.silentgo.core.ioc.bean.BeanFactory;
import com.silentgo.lc4e.util.shiro.UserRealm;
import com.silentgo.orm.base.DBConfig;
import com.silentgo.orm.base.DBManager;
import com.silentgo.orm.base.DBType;
import com.silentgo.orm.base.ManagerInitialCallBack;
import com.silentgo.orm.connect.ConnectManager;
import com.silentgo.orm.kit.configKit;
import com.silentgo.orm.source.druid.DruidManager;
import com.silentgo.shiro.ShiroInitConfig;
import com.silentgo.utils.PropKit;

import java.util.ArrayList;

/**
 * Project : lc4e
 * Package : com.teddy.lc4e.config
 *
 * @author <a href="mailto:teddyzhu15@gmail.com" target="_blank">teddyzhu</a>
 *         <p>
 *         Created by teddyzhu on 2016/10/10.
 */
public class Config implements com.silentgo.core.config.Config {

    private static PropKit propKit;

    @Override
    public void initialBuild(SilentGoConfig config) {

        //set db type
        config.setDbType(DBType.MYSQL.getName());

        //set user prop
        propKit = new PropKit("config.properties");

        //set druid connect
        DBConfig dbConfig = configKit.getConfig(propKit);
        ConnectManager.setDBManager(DBType.MYSQL, DruidManager.class);
        dbConfig.setCallBack(new ManagerInitialCallBack() {
            @Override
            public void before(DBManager dbManager) {
                DruidManager manager = (DruidManager) dbManager;
                manager.setLogAbandoned(true);
                manager.setRemoveAbandoned(true);
                manager.setMaxWait(2000);
                LogFilter logFilter = new Slf4jLogFilter();
                WallFilter wallFilter = new WallFilter();
                wallFilter.setDbType(DBType.MYSQL.getName());
                manager.setFilterList(new ArrayList<Filter>() {{
                    add(wallFilter);
                    add(logFilter);
                    add(new StatFilter());
                }});
            }

            @Override
            public void after(DBManager dbManager) {
            }
        });

        config.getDbConfigList().add(dbConfig);
        config.setUserProp(propKit);
        //enable shiro
        config.addExtraInitConfig(new ShiroInitConfig(new UserRealm()));

    }

    @Override
    public void afterInit(SilentGoConfig config) {

        CacheManager cacheManager = config.getCacheManager();
        cacheManager.evict(Key.ComVar);

        BeanFactory beanFactory = config.getFactory(config.getBeanClass(), SilentGo.me());


        beanFactory.addBean(propKit, true, false, true);
    }
}
