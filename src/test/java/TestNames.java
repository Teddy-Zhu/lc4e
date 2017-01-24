import java.lang.reflect.Field;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

/**
 * Project : lc4e
 * Package : PACKAGE_NAME
 *
 * @author <a href="mailto:teddyzhu15@gmail.com" target="_blank">teddyzhu</a>
 *         <p>
 *         Created by teddyzhu on 2016/10/28.
 */
public class TestNames<T> {

    public List<String> aaa = new ArrayList<>();

    public List<T> asdas = new ArrayList();

    public static void main(String[] args) throws NoSuchMethodException, SQLException, NoSuchFieldException {
        Field a = TestNames.class.getField("asdas");
        System.out.println(a);
    }

}
