
import com.silentgo.orm.generate.Generate;
import com.silentgo.orm.generate.GenerateConfig;

import java.io.IOException;
import java.sql.SQLException;

/**
 * Project : lc4e
 * Package : PACKAGE_NAME
 *
 * @author <a href="mailto:teddyzhu15@gmail.com" target="_blank">teddyzhu</a>
 *         <p>
 *         Created by teddyzhu on 2016/10/24.
 */
public class generatedb {

    public static void main(String[] args) throws SQLException, IOException, ClassNotFoundException {
        GenerateConfig config = new GenerateConfig();
        config.setPackagePath("com.silentgo.test.database");
        config.setOutPath("/Users/teddyzhu/Downloads/model");
        config.setDriver("com.mysql.cj.jdbc.Driver");
        config.setPass("12345678");
        config.setUser("root");
        config.setDbName("lc4e");
        config.setUrl("jdbc:mysql://localhost:3306/lc4e?useUnicode=true&characterEncoding=utf-8&useSSL=true");
        new Generate(config).GenerateModelAndDao();
    }
}
