package com.mn.common.utils;

/**
 * Redis所有Keys
 *
 * @author duxb
 * @email duxb@mippoint.com
 * @date 2017-07-18 19:51
 */
public class RedisKeys {

    public static String getSysConfigKey(String key){
        return "sys:config:" + key;
    }
}
