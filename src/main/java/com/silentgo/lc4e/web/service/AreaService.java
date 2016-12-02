package com.silentgo.lc4e.web.service;

import com.silentgo.core.ioc.annotation.Inject;
import com.silentgo.core.ioc.annotation.Service;
import com.silentgo.lc4e.database.dao.AreaDao;
import com.silentgo.lc4e.database.model.Area;
import com.silentgo.utils.CollectionKit;

import java.util.List;

/**
 * Project : lc4e
 * Package : com.silentgo.lc4e.web.service
 *
 * @author <a href="mailto:teddyzhu15@gmail.com" target="_blank">teddyzhu</a>
 *         <p>
 *         Created by teddyzhu on 2016/11/16.
 */
@Service
public class AreaService {

    @Inject
    AreaDao areaDao;

    public List<Area> getAreas() {
        return areaDao.queryListWhereIsPublishAndIsVisibleAndIsClose(true, true, false);
    }

    public Area getAreaDetail(String areaAbbr) {
        Area areaQuery = new Area();
        areaQuery.setAbbr(areaAbbr);
        List<Area> areas = areaDao.queryByModelSelective(areaQuery);

        if (!CollectionKit.isEmpty(areas)) {
            areaQuery.setDescription(areas.get(0).getDescription());
            return areaQuery;
        }
        return areaQuery;
    }
}
