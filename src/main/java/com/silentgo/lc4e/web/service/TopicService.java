package com.silentgo.lc4e.web.service;

import com.silentgo.core.ioc.annotation.Inject;
import com.silentgo.core.ioc.annotation.Service;
import com.silentgo.lc4e.config.Key;
import com.silentgo.lc4e.entity.Article;
import com.silentgo.lc4e.entity.Popup;
import com.silentgo.lc4e.tool.RelativeDate;
import com.silentgo.orm.base.TableModel;
import com.silentgo.orm.model.Page;
import com.silentgo.utils.StringKit;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Random;

/**
 * Created by teddy on 2015/9/23.
 */
@Service
public class TopicService {


    @Inject
    CurUserService curUserService;
    @Inject
    ComVarService comVarService;


    /**
     * all topic in time range(3 month)
     *
     * @param order 1:  by user favorite tag
     *              2: by topic publish time
     *              3: by last reply time
     * @return
     */
    public Page<Article> getTopic(int order, int page, int size) {

        return null;
    }


    public Page<Article> getArticle(int page, int order, String area) {
        Integer size = 10;
        if (StringKit.isBlank(area) || "all".equals(area)) {
            area = "";
            size = Integer.valueOf(comVarService.getComVarValueByName("IndexPageSize"));
        } else {
            size = Integer.valueOf(comVarService.getComVarValueByName("AreaPageSize"));
        }

        String[] cate = new String[]{"Java", "Obj-C", "C", "C++", "IOS", "Android"};
        String[] high = new String[]{"TOP", "NOTICE", "OTHER", "SYSTEM", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""};
        String[] users = new String[]{"Admin", "Test", "Myas", "Liakx", "Google", "vsss"};
        Date now = new Date();
        List<Article> list = new ArrayList<>();
        for (int i = 0; i < size; i++) {
            list.add(new Article("/themes/" + Key.kvs.get("Theme") + "/images/wireframe/image.png", new Popup("Matt", "Matt has been a member since July 2014"), "The friction between your thoughts and your code" + page, "/t/hello" + new Random().nextInt(1000), cate[new Random().nextInt(cate.length - 1)], users[new Random().nextInt(users.length - 1)], new Random().nextInt(100),
                    RelativeDate.format(RelativeDate.randomDate("2015-05-11 13:00:00", now), now), users[new Random().nextInt(users.length - 1)], page, high[new Random().nextInt(high.length - 1)]));
        }

        Page<Article> articlePage = new Page<>();
        articlePage.setPageSize(30);
        articlePage.setTotalPage(200);
        articlePage.setPageNumber(page);
        articlePage.setResult(list);
        return articlePage;
    }
}
