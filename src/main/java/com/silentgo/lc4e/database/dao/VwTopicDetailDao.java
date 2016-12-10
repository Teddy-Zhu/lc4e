package com.silentgo.lc4e.database.dao;

import com.silentgo.core.ioc.annotation.Service;
import com.silentgo.lc4e.database.model.VwTopicDetail;
import com.silentgo.orm.base.BaseDao;
import com.silentgo.orm.base.annotation.Param;
import com.silentgo.orm.sqlparser.annotation.*;

import java.util.Date;
import java.util.List;


@Service
public interface VwTopicDetailDao extends BaseDao<VwTopicDetail> {

    /**
     * order by create time
     *
     * @param date
     * @param start
     * @param size
     * @param area
     * @return
     */
    @ColumnIgnore({"content", "id"})
    @Where({"is_visible =?", "is_delete=?"})
    @WhereGroup({
            @WhereJudge(value = "area", condition = " area_abbr = <#area/> "),
            @WhereJudge(value = "createTime", condition = " create_time < <#createTime/> ")
    })
    public List<VwTopicDetail> queryWhereOrderByCreateTimeDescLimit(@Param("createTime") Date date, boolean isVisible, boolean isDelete, int start, int size, @Param("area") String area);

    /**
     * order by last comment time
     *
     * @param date
     * @param start
     * @param size
     * @param area
     * @return
     */
    @ColumnIgnore({"content", "id"})
    @Where({"is_visible =?", "is_delete=?"})
    @WhereGroup({
            @WhereJudge(value = "area", condition = " area_abbr = <#area/> "),
            @WhereJudge(value = "createTime", condition = " create_time < <#createTime/> ")
    })
    public List<VwTopicDetail> queryWhereOrderByCuserTimeDescLimit(@Param("createTime") Date date, boolean isVisible, boolean isDelete, int start, int size, @Param("area") String area);


    /**
     * order by comment count
     *
     * @param date
     * @param start
     * @param size
     * @param area
     * @return
     */
    @ColumnIgnore({"content", "id"})
    @Where({"is_visible =?", "is_delete=?"})
    @WhereGroup({
            @WhereJudge(value = "area", condition = " area_abbr = <#area/> "),
            @WhereJudge(value = "createTime", condition = " create_time < <#createTime/> ")
    })
    public List<VwTopicDetail> queryWhereOrderByCommentCountDescLimit(@Param("createTime") Date date, boolean isVisible, boolean isDelete, int start, int size, @Param("area") String area);


    @Where({"is_visible =?", "is_delete=?"})
    @WhereGroup({
            @WhereJudge(value = "area", condition = " area_abbr = <#area/> "),
            @WhereJudge(value = "createTime", condition = " create_time < <#createTime/> ")
    })
    public int countWhere(@Param("createTime") Date date, boolean isVisible, boolean isDelete, @Param("area") String area);

    @ColumnIgnore({"content", "id"})
    @OrderBy("match(tags) against (? in boolean mode) desc")
    @Where({"is_visible =?", "is_delete=?"})
    @WhereGroup({
            @WhereJudge(value = "area", condition = "area_abbr = <#area/> "),
            @WhereJudge(value = "createTime", condition = "create_time < <#createTime/> ")
    })
    public List<VwTopicDetail> queryUserLikeWhereOrderLimit(@Param("area") String area, @Param("createTime") Date date, boolean isVisible, boolean isDelete, String userTags, int start, int size);
}

