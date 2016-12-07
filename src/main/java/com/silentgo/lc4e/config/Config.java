package com.silentgo.lc4e.config;

import com.alibaba.druid.filter.Filter;
import com.alibaba.druid.filter.logging.Log4jFilter;
import com.alibaba.druid.filter.logging.LogFilter;
import com.alibaba.druid.filter.logging.Slf4jLogFilter;
import com.alibaba.druid.filter.stat.StatFilter;
import com.alibaba.druid.wall.WallFilter;
import com.silentgo.core.SilentGo;
import com.silentgo.core.cache.CacheManager;
import com.silentgo.core.config.SilentGoConfig;
import com.silentgo.core.render.support.RenderFactory;
import com.silentgo.core.render.support.RenderType;
import com.silentgo.jetbrick.JetTemplateRender;
import com.silentgo.jetbrick.JetbrickInitConfig;
import com.silentgo.lc4e.tool.TemplateTool;
import com.silentgo.lc4e.tool.staticIncludeTag;
import com.silentgo.lc4e.util.shiro.UserRealm;
import com.silentgo.lc4e.web.service.ComVarService;
import com.silentgo.lc4e.web.service.MenuService;
import com.silentgo.orm.base.DBConfig;
import com.silentgo.orm.base.DBManager;
import com.silentgo.orm.base.DBType;
import com.silentgo.orm.base.ManagerInitialCallBack;
import com.silentgo.orm.connect.ConnectManager;
import com.silentgo.orm.kit.configKit;
import com.silentgo.orm.source.druid.DruidManager;
import com.silentgo.orm.source.druid.DruidPool;
import com.silentgo.shiro.ShiroInitConfig;
import com.silentgo.shiro.ShiroMethod;
import com.silentgo.utils.PropKit;
import jetbrick.template.JetGlobalContext;
import jetbrick.template.resolver.GlobalResolver;

import java.util.ArrayList;
import java.util.List;
import java.util.Properties;

/**
 * Project : lc4e
 * Package : com.teddy.lc4e.config
 *
 * @author <a href="mailto:teddyzhu15@gmail.com" target="_blank">teddyzhu</a>
 *         <p>
 *         Created by teddyzhu on 2016/10/10.
 */
public class Config implements com.silentgo.core.config.Config {

    @Override
    public void initialBuild(SilentGoConfig config) {

        //set db type
        config.setDbType(DBType.MYSQL.getName());

        //set user prop
        PropKit propKit = new PropKit("config.properties");

        //set druid connect
        DBConfig dbConfig = configKit.getConfig(propKit);
        ConnectManager.setDBManager(DBType.MYSQL, DruidManager.class);
        dbConfig.setCallBack(new ManagerInitialCallBack() {
            @Override
            public void before(DBManager dbManager) {
                DruidManager manager = (DruidManager) dbManager;
                manager.setLogAbandoned(true);
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
        //filter static files
        config.addEndStatic(".ico");
        config.addStartStatic("/themes");

        //enable shiro
        config.addExtraInitConfig(new ShiroInitConfig(new UserRealm()));
        config.addExtraInitConfig(new JetbrickInitConfig());


    }

    @Override
    public void afterInit(SilentGoConfig config) {


        CacheManager cacheManager = config.getCacheManager();
        cacheManager.evict(Key.ComVar);

        RenderFactory renderFactory = config.getFactory(RenderFactory.class, SilentGo.me());


        ComVarService comVarService = (ComVarService) config.getBean(ComVarService.class.getName()).getObject();
        Key.kvs.put("Theme", comVarService.getComVarValueByName("DefaultTheme"));

        Properties properties = new Properties();
        properties.setProperty("templateSuffix", ".html");
        properties.setProperty("trimDirectiveComments", "true");
        properties.setProperty("trimDirectiveCommentsPrefix", "<!---");
        properties.setProperty("trimDirectiveCommentsSuffix", "--->");
        properties.setProperty("jetx.template.loaders", "$loader");
        properties.setProperty("$loader", "jetbrick.template.loader.ServletResourceLoader");
        properties.setProperty("$loader.root", "/WEB-INF/views/themes/" + Key.kvs.get("Theme"));
        properties.setProperty("$loader.reloadable", "true");

        JetTemplateRender jetTemplateRender = new JetTemplateRender(properties);
        renderFactory.addAndReplaceRender(RenderType.View, jetTemplateRender);

        GlobalResolver resolver = jetTemplateRender.getEngine().getGlobalResolver();
        resolver.registerFunctions(ShiroMethod.class);
        resolver.registerFunctions(TemplateTool.class);
        resolver.registerTags(staticIncludeTag.class);

        JetGlobalContext globalContext = jetTemplateRender.getEngine().getGlobalContext();


        MenuService menuService = (MenuService) config.getBean(MenuService.class).getObject();
        globalContext.set(String.class, "SiteName", comVarService.getComVarValueByName("SiteName"));
        globalContext.set(List.class, "menulist", menuService.getMenuTree());
        globalContext.set(String.class, "menusString", config.getJsonPaser().toJsonString(menuService.getMenuTree()));
        globalContext.set(String.class, "version", comVarService.getComVarValueByName("Version"));
        //add cdn
        //"http://7u2sne.com1.z0.glb.clouddn.com" +
        globalContext.set(String.class, "Theme", "/themes/" + Key.kvs.get("Theme"));
        globalContext.set(String.class, "userImg", comVarService.getComVarValueByName("Avatar"));


        config.getStaticMapping().put("/themes", "/themes/" + Key.kvs.get("Theme"));
    }
}
