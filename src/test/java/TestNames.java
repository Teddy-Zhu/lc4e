import com.silentgo.lc4e.web.service.UrlGenerateService;
import com.silentgo.orm.source.jdbc.JDBCManager;
import com.silentgo.utils.ReflectKit;
import com.silentgo.utils.random.RandomUtil;
import com.silentgo.utils.reflect.SGClass;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.SQLException;

/**
 * Project : lc4e
 * Package : PACKAGE_NAME
 *
 * @author <a href="mailto:teddyzhu15@gmail.com" target="_blank">teddyzhu</a>
 *         <p>
 *         Created by teddyzhu on 2016/10/28.
 */
public class TestNames {
    public static void main(String[] args) throws NoSuchMethodException, SQLException {

        SGClass sgClass = ReflectKit.getSGClass(UrlGenerateService.class);
        return;
    }

}
