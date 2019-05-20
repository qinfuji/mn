package com.mn.modules.api.remote.impl;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.mn.modules.api.entity.ChancePoint;
import com.mn.modules.api.remote.ShopService;
import com.mn.modules.api.utils.Tools;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.text.DecimalFormat;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class ShopServiceImpl implements ShopService {

    private Logger LOG = LoggerFactory.getLogger(ShopServiceImpl.class);

    private static final String APPID = "topdata20190001";
    private static final String TOKEN = "ahxop4yvqar1gbizumx2rpy98kp2ev";
    private static final String HOST = "http://bi.topprism.com/api/fromhcr";
    private static final String PROVINCE_PATH = "/get_province";
    private static final String CITY_PATH = "/get_city";
    private static final String GET_SHOP = "/get_shop";

    private Map<String, Map<String, String>> userAccountProvinceMap = new ConcurrentHashMap(new HashMap<>());
    //key是userAccount_provincecode
    private Map<String, Map<String, String>> userAccountCityMap = new ConcurrentHashMap(new HashMap<>());

    private Map<String, Boolean> accountLoadedMap = new HashMap();

    @Autowired
    RestTemplate restTemplate;

    @Override
    public void init(String userAccount) {
        try {
            Map<String, String> p = getProvince(userAccount);
            if (p == null) {
                accountLoadedMap.put(userAccount, new Boolean(true));
            }
            userAccountProvinceMap.put(userAccount, p);
            Map citys = getCitys(userAccount, new ArrayList<>(p.values()));
            if (citys != null) {
                userAccountCityMap.putAll(citys);
            }
            accountLoadedMap.put(userAccount, new Boolean(true));
        } catch (Exception e) {

        }
    }

    @Override
    public Map<String, String> getProvince(String account) {
        Map<String, String> map = new HashMap<>();
        map.put("user_account", account);
        map.put("appid", APPID);

        Map signParamMap = Tools.sign(map, TOKEN);
        MultiValueMap<String, String> requestMap = new LinkedMultiValueMap<String, String>();
        signParamMap.forEach((key, value) -> {
            requestMap.add((String) key, (String) value);
        });

        ResponseEntity<String> responseBody = restTemplate.postForEntity(HOST + PROVINCE_PATH, requestMap, String.class);
        String responseString = responseBody.getBody();
        try {
            Map _ret = getResultMap(account, responseString);

            return _ret;
        } catch (Exception err) {
            throw new RuntimeException("");
        }

    }

    @Override
    public Map<String, Map<String,String>> getCitys(String userAccount, List<String> provinceKeys) {
        Map<String, String> map = new HashMap<>();
        map.put("user_account", userAccount);
        map.put("appid", APPID);

        Map<String, Map<String , String>> result = new HashMap<>();
        provinceKeys.forEach((provinceKey) -> {
            map.put("province", provinceKey);
            Map signParamMap = Tools.sign(map, TOKEN);

            MultiValueMap<String, String> requestMap = new LinkedMultiValueMap<String, String>();
            signParamMap.forEach((key, value) -> {
                requestMap.add((String) key, (String) value);
            });
            ResponseEntity<String> responseBody = restTemplate.postForEntity(HOST + CITY_PATH, requestMap, String.class);
            try {
                Map _ret = getResultMap(userAccount, responseBody.getBody());
                if (_ret != null) {
                    result.put(userAccount+"_"+provinceKey , _ret);
                }
            } catch (Exception err) {
                throw new RuntimeException("");
            }
        });
        return result;
    }

    private Map<String, String> getResultMap(String account, String responseString) {
        JSONObject jsonObject = JSON.parseObject(responseString);
        Integer code = jsonObject.getInteger("code");

        if (code != 0) {
            LOG.error("获取用户省编码失败 ， account:{} , reason: {}", account, jsonObject.getString("msg"));
            throw new RuntimeException("请求错误");
        } else {
            JSONArray datas = jsonObject.getJSONArray("data");
            Map provinceNameMap = new HashMap<>();
            for (int i = 0; i < datas.size(); i++) {
                JSONObject item = datas.getJSONObject(i);
                String key = item.getString("key");
                String name = item.getString("name");
                provinceNameMap.put(name, key);

            }
            return provinceNameMap;
        }
    }

    @Override
    public List<ChancePoint> getChancePointList(String userAccount, String province, String city) {
        if (accountLoadedMap.get(userAccount) == null) {
            //初始化呢账号区域
            init(userAccount);
        }
        if (userAccountProvinceMap.get(userAccount) == null) {
            return new ArrayList<>();
        }
        //转换省
        String provinceCode ="";
        Map<String, String> ps = userAccountProvinceMap.get(userAccount);
        for (Map.Entry<String, String> entry : ps.entrySet()) {
             String name =  entry.getKey();
             if(province.indexOf(name)!= -1 || name.indexOf(province)!=-1){
                 provinceCode = entry.getValue();
                 break;
             }
        }
        if(Objects.isNull(provinceCode) || "".equals(provinceCode)){
            return new ArrayList<>();
        }

        String cityCode ="";
        Map<String, String> citys = userAccountCityMap.get(userAccount+"_"+provinceCode);
        if(citys == null || citys.size()==0){
            return new ArrayList<>();
        }
        for (Map.Entry<String, String> entry : citys.entrySet()) {
            String name =  entry.getKey();
            if(city.indexOf(name)!= -1 || name.indexOf(city)!=-1){
                cityCode = entry.getValue();
                break;
            }
        }
        if(Objects.isNull(cityCode) || "".equals(cityCode)){
            return new ArrayList<>();
        }

        Map<String, String> map = new HashMap<>();
        map.put("user_account", userAccount);
        map.put("province", provinceCode);
        map.put("city", cityCode);
        map.put("appid", APPID);

        Map signParamMap = Tools.sign(map, TOKEN);

        Map<String, String> result = new HashMap<>();

        MultiValueMap<String, String> requestMap = new LinkedMultiValueMap<String, String>();
        signParamMap.forEach((key, value) -> {
            requestMap.add((String) key, (String) value);
        });

        ResponseEntity<String> responseBody = restTemplate.postForEntity(HOST + GET_SHOP, requestMap, String.class);
        String responseString = responseBody.getBody();
        JSONObject jsonObject = JSON.parseObject(responseString);
        Integer code = jsonObject.getInteger("code");

        if(code !=0){
            return new ArrayList<>();
        }

        List<ChancePoint>  chanceList  = new ArrayList<>();
        JSONArray shoplist = jsonObject.getJSONArray("data");
        for (int i = 0; i < shoplist.size(); i++) {
            JSONObject  shop = shoplist.getJSONObject(i);
            ChancePoint cp = new ChancePoint();
            cp.setProvinceName(shop.getString("province"));
            cp.setProvince(shop.getString("province_code"));
            cp.setCityName(shop.getString("city"));
            cp.setCity(shop.getString("city_code"));
            cp.setName(shop.getString("name"));
            cp.setLat(shop.getDouble("lat")); //纬度
            cp.setLng(shop.getDouble("lng")); //经度
            cp.setShopId(shop.getString("id"));
            chanceList.add(cp);
        }
        return chanceList;
    }

    @Override
    public String getChancePointShopId(String userAccount, ChancePoint chancePoint) {
        List<ChancePoint> shopList =  getChancePointList(userAccount , chancePoint.getProvinceName() , chancePoint.getCityName());
        if(shopList == null || shopList.size()==0){
            return null;
        }
        for (int i = 0; i < shopList.size(); i++) {
            ChancePoint shop = shopList.get(i);
            DecimalFormat df = new DecimalFormat("#.000000");
            if( df.format(chancePoint.getLat()).equals(df.format(shop.getLat()))
                    && df.format(chancePoint.getLng()).equals(df.format(shop.getLng()))){
                return shop.getShopId();
            }
        }
        return null;
    }
}
