import com.silentgo.lc4e.web.event.listener.ViewTopicCountListener;
import com.silentgo.utils.ReflectKit;
import com.silentgo.utils.reflect.SGClass;
import com.silentgo.utils.reflect.SGClassParseKit;

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

    public static void main(String[] args) throws NoSuchMethodException, SQLException, NoSuchFieldException {
       // SGClass sgClass = ReflectKit.getSGClass(ViewTopicCountListener.class);

        int i = 1;
        long start = System.currentTimeMillis();
        for (int i1 = 0; i1 < i; i1++) {
            SGClassParseKit.parse(ViewTopicCountListener.class);
        }
        System.out.println(System.currentTimeMillis() - start);
    }

}
