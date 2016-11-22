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


    @Where({" create_time < ? "})
    @ColumnIgnore({"content", "id"})
    @WhereGroup(
            @WhereJudge(value = "area", condition = " area_abbr = <#area/> ")
    )
    public List<VwTopicDetail> queryWhereOrderByCreateTimeDescLimit(Date date, int start, int size, @Param("area") String area);


    @Where("vw_topic_detail.create_time > ?")
    @LeftJoin(value = "comment", on = "comment.topic_id = vw_topic_detail.id")
    @OrderBy("max(comment.create_time) desc")
    @WhereGroup(
            @WhereJudge(value = "area", condition = " area_abbr = <#area/> ")
    )
    @ColumnIgnore({"content", "id"})
    public List<VwTopicDetail> queryWhereGroupByIdOrderLimit(Date date, int start, int size, @Param("area") String area);

    @Where({" create_time < ? "})
    @WhereGroup(
            @WhereJudge(value = "area", condition = " area_abbr = <#area/> ")
    )
    public int countWhere(Date date, @Param("area") String area);

    @ColumnIgnore({"content", "id"})
    @Select(" select vw_topic_detail.* from vw_topic_detail where id in (<#id/>) order by field(id,<#id/>) ")
    public List<VwTopicDetail> queryByIds(@Param("id") List<String> id);

}

