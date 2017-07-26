import com.silentgo.json.JSON;
import com.silentgo.lc4e.web.service.model.SimpleTopicInfo;
import com.silentgo.utils.DateKit;

import java.beans.IntrospectionException;
import java.sql.SQLException;
import java.util.Calendar;
import java.util.Date;

/**
 * Project : lc4e
 * Package : PACKAGE_NAME
 *
 * @author <a href="mailto:teddyzhu15@gmail.com" target="_blank">teddyzhu</a>
 *         <p>
 *         Created by teddyzhu on 2016/10/28.
 */
public class TestNames<T> {

    public static void main(String[] args) throws NoSuchMethodException, SQLException, NoSuchFieldException, IntrospectionException {

        SimpleTopicInfo[] simpleTopicInfos = new SimpleTopicInfo[3];

        simpleTopicInfos[0] = new SimpleTopicInfo();
        simpleTopicInfos[1] = new SimpleTopicInfo();
        simpleTopicInfos[2] = new SimpleTopicInfo();

        System.out.println(JSON.toJSONString(simpleTopicInfos));
    }

}
