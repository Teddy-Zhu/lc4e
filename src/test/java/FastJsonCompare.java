import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import com.silentgo.lc4e.database.model.Menu;
import com.silentgo.utils.random.RandomUtil;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

/**
 * Project : lc4e
 * Package : PACKAGE_NAME
 *
 * @author <a href="mailto:teddyzhu15@gmail.com" target="_blank">teddyzhu</a>
 *         <p>
 *         Created by teddyzhu on 2016/10/25.
 */
public class FastJsonCompare {
    public static void main(String[] args) {

        List<Menu> menus = new ArrayList<>();

        for (int i = 0; i < 100; i++) {
            Menu m = new Menu();
            m.setAbbr(RandomUtil.String(10));
            m.setIcon(RandomUtil.String(10));
            m.setCreateTime(new Date());
            m.setCss(RandomUtil.String(10));
            m.setId((long) RandomUtil.number(5));
            menus.add(m);
        }
        Gson gson = new Gson();

        long start = System.currentTimeMillis();

        String a = gson.toJson(menus);

        long end = System.currentTimeMillis();


        long start2 = System.currentTimeMillis();

        List<Menu> ac = gson.fromJson(a, new TypeToken<List<Menu>>() {
        }.getType());

        long end2 = System.currentTimeMillis();

        System.out.println(end - start);
        System.out.println(end2 - start2);
    }
}
