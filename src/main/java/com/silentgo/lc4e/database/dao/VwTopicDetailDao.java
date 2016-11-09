package com.silentgo.lc4e.database.dao;

import com.silentgo.core.ioc.annotation.Service;
import com.silentgo.lc4e.database.model.VwTopicDetail;
import com.silentgo.orm.base.BaseDao;
import com.silentgo.orm.base.annotation.Param;
import com.silentgo.orm.sqlparser.annotation.Select;
import com.silentgo.orm.sqlparser.annotation.Where;

import java.util.Date;
import java.util.List;


@Service
public interface VwTopicDetailDao extends BaseDao<VwTopicDetail> {


    @Where({" create_time > ? "})
    public List<VwTopicDetail> queryWhereOrderByCreateTimeDescLimit(Date date, int start, int size);
    @Where({" create_time > ? "})
    public int countWhere(Date date);

    @Select(" select vw_topic_detail.* from vw_topic_detail left join comment on  comment.topic_id = vw_topic_detail.id where vw_topic_detail.create_time > ? group by vw_topic_detail.id order by comment.create_time limit ?,?")
    public List<VwTopicDetail> queryByLastComment(Date date, int start, int size);

    @Select(" select vw_topic_detail.* from vw_topic_detail where id in (<#id/>) order by field(id,<#id/>) ")
    public List<VwTopicDetail> queryByIds(@Param("id") List<String> id);

}

