package com.silentgo.lc4e.tool;

import javax.management.ReflectionException;
import java.lang.reflect.*;
import java.util.Arrays;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.function.Function;

public class ReflectTool {

    private static Map<Class, Class> classMap;

    private static Map<Class, Function<String, Object>> functionMap;

    static {
        classMap = new HashMap<>();
        classMap.put(boolean.class, Boolean.class);
        classMap.put(int.class, Integer.class);
        classMap.put(long.class, Long.class);
        classMap.put(short.class, Short.class);
        classMap.put(byte.class, Byte.class);
        classMap.put(double.class, Double.class);
        classMap.put(float.class, Float.class);
        classMap.put(char.class, Character.class);
        classMap.put(void.class, Void.class);

        functionMap = new HashMap<>();
        functionMap.put(String.class, String::toString);
        functionMap.put(Boolean.class, (x) -> {
            Boolean returnVal = null;
            try {
                returnVal = Long.valueOf(x) == 1;
            } catch (Exception e) {
                return Boolean.valueOf(x);
            }
            return returnVal;
        });
        functionMap.put(Integer.class, Integer::valueOf);
        functionMap.put(Float.class, Float::valueOf);
        functionMap.put(Double.class, Double::valueOf);
        functionMap.put(Long.class, Boolean::valueOf);

    }

    public static ReflectTool on(String name) throws ReflectionException {
        return on(forName(name));
    }


    public static ReflectTool on(Class<?> clazz) {
        return new ReflectTool(clazz);
    }

    public static ReflectTool on(Object object) {
        return new ReflectTool(object);
    }

    public static <T extends AccessibleObject> T accessible(T accessible) {
        if (accessible == null) {
            return null;
        }

        if (!accessible.isAccessible()) {
            accessible.setAccessible(true);
        }

        return accessible;
    }

    private final Object object;


    private final boolean isClass;


    private ReflectTool(Class<?> type) {
        this.object = type;
        this.isClass = true;
    }

    private ReflectTool(Object object) {
        this.object = object;
        this.isClass = false;
    }

    @SuppressWarnings("unchecked")
    public <T> T get() {
        return (T) object;
    }

    public ReflectTool set(String name, Object value) throws ReflectionException {
        try {

            // Try setting a public field
            Field field = type().getField(name);
            field.set(object, unwrap(value));
            return this;
        } catch (Exception e1) {

            // Try again, setting a non-public field
            try {
                accessible(type().getDeclaredField(name)).set(object, unwrap(value));
                return this;
            } catch (Exception e2) {
                throw new ReflectionException(e2);
            }
        }
    }

    public <T> T get(String name) throws ReflectionException {
        return field(name).<T>get();
    }

    public Field getDeclaredField(Class<?> clazz, String name) throws NoSuchFieldException {
        Field field = null;
        while (clazz != Object.class) {
            try {
                field = clazz.getDeclaredField(name);
                if (field != null)
                    break;
            } catch (Exception e) {
                clazz = clazz.getSuperclass();
            }
        }
        if (field == null) {
            throw new NoSuchFieldException("name is not found");
        }
        return field;
    }

    public ReflectTool field(String name) throws ReflectionException {
        try {

            // Try getting a public field
            Field field = type().getField(name);
            return on(field.get(object));
        } catch (Exception e1) {

            // Try again, getting a non-public field
            try {
                return on(accessible(getDeclaredField(type(), name)).get(object));
            } catch (Exception e2) {
                throw new ReflectionException(e2);
            }
        }
    }

    public Map<String, ReflectTool> fields() throws ReflectionException {
        Map<String, ReflectTool> result = new LinkedHashMap<>();

        for (Field field : type().getFields()) {
            if (!isClass ^ Modifier.isStatic(field.getModifiers())) {
                String name = field.getName();
                result.put(name, field(name));
            }
        }

        return result;
    }

    public ReflectTool call(String name) throws ReflectionException {
        return call(name, new Object[0]);
    }

    public ReflectTool call(String name, Object... args) throws ReflectionException {
        Class<?>[] types = types(args);

        // Try invoking the "canonical" method, i.e. the one with exact
        // matching argument types
        try {
            Method method = exactMethod(name, types);
            return on(method, object, args);
        }

        // If there is no exact match, try to find a method that has a "similar"
        // signature if primitive argument types are converted to their wrappers
        catch (NoSuchMethodException e) {
            try {
                Method method = similarMethod(name, types);
                return on(method, object, args);
            } catch (NoSuchMethodException e1) {
                throw new ReflectionException(e1);
            }
        }
    }


    private Method exactMethod(String name, Class<?>[] types) throws NoSuchMethodException {
        final Class<?> type = type();
        try {
            return type.getMethod(name, types);
        } catch (NoSuchMethodException e) {
            return type.getDeclaredMethod(name, types);
        }
    }

    private Method similarMethod(String name, Class<?>[] types) throws NoSuchMethodException {
        final Class<?> type = type();

        for (Method method : type.getMethods()) {
            if (isSimilarSignature(method, name, types)) {
                return method;
            }
        }

        for (Method method : type.getDeclaredMethods()) {
            if (isSimilarSignature(method, name, types)) {
                return method;
            }
        }

        throw new NoSuchMethodException("No similar method " + name + " with params " + Arrays.toString(types)
                + " could be found on type " + type() + ".");
    }


    private boolean isSimilarSignature(Method possiblyMatchingMethod, String desiredMethodName,
                                       Class<?>[] desiredParamTypes) {
        return possiblyMatchingMethod.getName().equals(desiredMethodName)
                && match(possiblyMatchingMethod.getParameterTypes(), desiredParamTypes);
    }

    public ReflectTool create() throws ReflectionException {
        return create(new Object[0]);
    }


    public ReflectTool create(Object... args) throws ReflectionException {
        Class<?>[] types = types(args);

        // Try invoking the "canonical" constructor, i.e. the one with exact
        // matching argument types
        try {
            Constructor<?> constructor = type().getDeclaredConstructor(types);
            return on(constructor, args);
        }

        // If there is no exact match, try to find one that has a "similar"
        // signature if primitive argument types are converted to their wrappers
        catch (NoSuchMethodException e) {
            for (Constructor<?> constructor : type().getConstructors()) {
                if (match(constructor.getParameterTypes(), types)) {
                    return on(constructor, args);
                }
            }

            throw new ReflectionException(e);
        }
    }

    @SuppressWarnings("unchecked")
    public <P> P as(Class<P> proxyType) {
        final boolean isMap = (object instanceof Map);
        final InvocationHandler handler = (proxy, method, args) -> {
            String name = method.getName();

            // Actual method name matches always come first
            try {
                return on(object).call(name, args).get();
            }

            // [#14] Simulate POJO behaviour on wrapped map objects
            catch (ReflectionException e) {
                if (isMap) {
                    Map<String, Object> map = (Map<String, Object>) object;
                    int length = (args == null ? 0 : args.length);

                    if (length == 0 && name.startsWith("get")) {
                        return map.get(property(name.substring(3)));
                    } else if (length == 0 && name.startsWith("is")) {
                        return map.get(property(name.substring(2)));
                    } else if (length == 1 && name.startsWith("set")) {
                        map.put(property(name.substring(3)), args[0]);
                        return null;
                    }
                }

                throw e;
            }
        };

        return (P) Proxy.newProxyInstance(proxyType.getClassLoader(), new Class[]{proxyType}, handler);
    }


    private static String property(String string) {
        int length = string.length();

        if (length == 0) {
            return "";
        } else if (length == 1) {
            return string.toLowerCase();
        } else {
            return string.substring(0, 1).toLowerCase() + string.substring(1);
        }
    }

    private boolean match(Class<?>[] declaredTypes, Class<?>[] actualTypes) {
        if (declaredTypes.length == actualTypes.length) {
            for (int i = 0; i < actualTypes.length; i++) {
                if (!wrapper(declaredTypes[i]).isAssignableFrom(wrapper(actualTypes[i]))) {
                    return false;
                }
            }

            return true;
        } else {
            return false;
        }
    }


    @Override
    public int hashCode() {
        return object.hashCode();
    }

    @Override
    public boolean equals(Object obj) {
        if (obj instanceof ReflectTool) {
            return object.equals(((ReflectTool) obj).get());
        }

        return false;
    }

    @Override
    public String toString() {
        return object.toString();
    }


    private static ReflectTool on(Constructor<?> constructor, Object... args) throws ReflectionException {
        try {
            return on(accessible(constructor).newInstance(args));
        } catch (Exception e) {
            throw new ReflectionException(e);
        }
    }


    private static ReflectTool on(Method method, Object object, Object... args) throws ReflectionException {
        try {
            accessible(method);

            if (method.getReturnType() == void.class) {
                method.invoke(object, args);
                return on(object);
            } else {
                return on(method.invoke(object, args));
            }
        } catch (Exception e) {
            throw new ReflectionException(e);
        }
    }

    private static Object unwrap(Object object) {
        if (object instanceof ReflectTool) {
            return ((ReflectTool) object).get();
        }

        return object;
    }


    private static Class<?>[] types(Object... values) {
        if (values == null) {
            return new Class[0];
        }

        Class<?>[] result = new Class[values.length];

        for (int i = 0; i < values.length; i++) {
            Object value = values[i];
            result[i] = value == null ? Object.class : value.getClass();
        }

        return result;
    }


    private static Class<?> forName(String name) throws ReflectionException {
        try {
            return Class.forName(name);
        } catch (Exception e) {
            throw new ReflectionException(e);
        }
    }

    public Class<?> type() {
        if (isClass) {
            return (Class<?>) object;
        } else {
            return object.getClass();
        }
    }


    public static Class<?> wrapper(Class<?> type) {
        if (type == null) {
            return null;
        } else if (type.isPrimitive()) {
            return classMap.get(type);
        }
        return type;
    }

    public static Object wrapperObject(Class clazz, String object) {
        Class clz = wrapper(clazz);
        return functionMap.containsKey(clz) ? functionMap.get(clz).apply(object) : object;
    }


}