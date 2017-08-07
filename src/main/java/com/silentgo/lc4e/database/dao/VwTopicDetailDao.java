package com.silentgo.lc4e.database.dao;

import com.silentgo.core.ioc.annotation.Service;
import com.silentgo.lc4e.database.model.VwTopicDetail;
import com.silentgo.orm.base.BaseDao;
import com.silentgo.orm.base.Pager;
import com.silentgo.orm.base.annotation.Param;
import com.silentgo.orm.sqlparser.annotation.*;

import java.util.Date;
import java.util.List;


@Service
public interface VwTopicDetailDao extends BaseDao<VwTopicDetail, Long> {

    /**
     * order by create time
     *
     * @param date
     * @param pager
     * @param area
     * @return
     */
    @ColumnIgnore({"content", "id"})
    @Where({"is_visible =<#isVisible/>", "is_delete=<#isDelete/>"})
    @WhereGroup({
            @WhereJudge(value = "area", condition = " area_abbr = <#area/> "),
            @WhereJudge(value = "createTime", condition = " create_time < <#createTime/> ")
    })
    public List<VwTopicDetail> queryWhereOrderByCreateTimeDescLimit(@Param("createTime") Date date, @Param("isVisible") boolean isVisible, @Param("isDelete") boolean isDelete, Pager pager, @Param("area") String area);

    /**
     * order by last comment time
     *
     * @param date
     * @param pager
     * @param area
     * @return
     */
    @ColumnIgnore({"content", "id"})
    @Where({"is_visible =<#isVisible/>", "is_delete=<#isDelete/>"})
    @WhereGroup({
            @WhereJudge(value = "area", condition = " area_abbr = <#area/> "),
            @WhereJudge(value = "createTime", condition = " create_time < <#createTime/> ")
    })
    public List<VwTopicDetail> queryWhereOrderByCuserTimeDescLimit(@Param("createTime") Date date, @Param("isVisible") boolean isVisible, @Param("isDelete") boolean isDelete, Pager pager, @Param("area") String area);


    /**
     * order by comment count
     *
     * @param date
     * @param pager
     * @param area
     * @return
     */
    @ColumnIgnore({"content", "id"})
    @Where({"is_visible =<#isVisible/>", "is_delete=<#isDelete/>"})
    @WhereGroup({
            @WhereJudge(value = "area", condition = " area_abbr = <#area/> "),
            @WhereJudge(value = "createTime", condition = " create_time < <#createTime/> ")
    })
    public List<VwTopicDetail> queryWhereOrderByCommentCountDescLimit(@Param("createTime") Date date, @Param("isVisible") boolean isVisible, @Param("isDelete") boolean isDelete, Pager pager, @Param("area") String area);


    @Where({"is_visible =<#isVisible/>", "is_delete=<#isDelete/>"})
    @WhereGroup({
            @WhereJudge(value = "area", condition = " area_abbr = <#area/> "),
            @WhereJudge(value = "createTime", condition = " create_time < <#createTime/> ")
    })
    public int countWhere(@Param("createTime") Date date, @Param("isVisible") boolean isVisible, @Param("isDelete") boolean isDelete, @Param("area") String area);

    @ColumnIgnore({"content", "id"})
    @OrderBy("match(tags) against (<#userTags/> in boolean mode) desc")
    @Where({"is_visible =<#isVisible/>", "is_delete=<#isDelete/>"})
    @WhereGroup({
            @WhereJudge(value = "area", condition = "area_abbr = <#area/> "),
            @WhereJudge(value = "createTime", condition = "create_time < <#createTime/> ")
    })
    public List<VwTopicDetail> queryUserLikeWhereOrderByLimit(@Param("area") String area, @Param("createTime") Date date, @Param("isVisible") boolean isVisible, @Param("isDelete") boolean isDelete, @Param("userTags") String userTags, Pager pager);

    @ColumnIgnore({"content"})
    @WhereGroup({
            @WhereJudge(value = "isVisible", condition = " is_visible = <#isVisible/> "),
            @WhereJudge(value = "isDelete", condition = " is_delete = <#isDelete/> "),
            @WhereJudge(value = "isClose", condition = " is_close = <#isClose/> "),
            @WhereJudge(value = "isComment", condition = " is_comment = <#isComment/> "),
            @WhereJudge(value = "area", condition = " area_id = <#area/> "),
            @WhereJudge(value = "createBeginTime", condition = " create_time >= <#createBeginTime/> "),
            @WhereJudge(value = "createEndTime", condition = " create_time <= <#createEndTime/> "),
            @WhereJudge(value = "updateBeginTime", condition = " update_time >= <#updateBeginTime/> "),
            @WhereJudge(value = "updateEndTime", condition = " update_time <= <#updateEndTime/> ")
    })
    public List<VwTopicDetail> queryWhereOrderByCreateTimeDescLimit(@Param("createBeginTime") Date createBeginTime,
                                                                    @Param("createEndTime") Date createEndTime,
                                                                    @Param("updateBeginTime") Date updateBeginTime,
                                                                    @Param("updateEndTime") Date updateEndTime,
                                                                    @Param("area") Long area,
                                                                    @Param("isVisible") Boolean isVisible,
                                                                    @Param("isDelete") Boolean isDelete,
                                                                    @Param("isClose") Boolean isClose,
                                                                    @Param("isComment") Boolean isComment,
                                                                    Pager pager);


    @WhereGroup({
            @WhereJudge(value = "isVisible", condition = " is_visible = <#isVisible/> "),
            @WhereJudge(value = "isDelete", condition = " is_delete = <#isDelete/> "),
            @WhereJudge(value = "isClose", condition = " is_close = <#isClose/> "),
            @WhereJudge(value = "isComment", condition = " is_comment = <#isComment/> "),
            @WhereJudge(value = "area", condition = " area_id = <#area/> "),
            @WhereJudge(value = "createBeginTime", condition = " create_time >= <#createBeginTime/> "),
            @WhereJudge(value = "createEndTime", condition = " create_time <= <#createEndTime/> "),
            @WhereJudge(value = "updateBeginTime", condition = " update_time >= <#updateBeginTime/> "),
            @WhereJudge(value = "updateEndTime", condition = " update_time <= <#updateEndTime/> ")
    })
    public int countWhere(@Param("createBeginTime") Date createBeginTime,
                          @Param("createEndTime") Date createEndTime,
                          @Param("updateBeginTime") Date updateBeginTime,
                          @Param("updateEndTime") Date updateEndTime,
                          @Param("area") Long area,
                          @Param("isVisible") Boolean isVisible,
                          @Param("isDelete") Boolean isDelete,
                          @Param("isClose") Boolean isClose,
                          @Param("isComment") Boolean isComment);

}

