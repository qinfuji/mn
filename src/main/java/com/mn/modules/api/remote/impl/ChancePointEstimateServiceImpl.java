package com.mn.modules.api.remote.impl;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.mn.modules.api.entity.ChancePoint;
import com.mn.modules.api.remote.ChancePointEstimateService;
import com.mn.modules.api.utils.Tools;
import com.mn.modules.api.vo.Quota;
import com.mn.modules.api.vo.QuotaItem;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.function.Function;

@Component
public class ChancePointEstimateServiceImpl implements ChancePointEstimateService {

    private Logger LOG = LoggerFactory.getLogger(ChancePointEstimateServiceImpl.class);

    private static final String APPID = "topdata20190001";
    private static final String TOKEN = "ahxop4yvqar1gbizumx2rpy98kp2ev";
    private static final String HOST = "http://bi.topprism.com/api/fromhcr";

    private static final String JSON_DATA_TYPE_OBJECT = "jsonObject";
    private static final String JSON_DATA_TYPE_ARRAY = "jsonArray";
    @Autowired
    RestTemplate restTemplate;


    private Quota request(String account, String path, Map requestParam, String dataType, Function<Object, Quota> callback) {

        requestParam.put("appid", APPID);
        Map signParamMap = Tools.sign(requestParam, TOKEN);
        MultiValueMap<String, String> requestMap = new LinkedMultiValueMap<String, String>();
        signParamMap.forEach((key, value) -> {
            requestMap.add((String) key, (String) value);
        });
        ResponseEntity<String> responseBody = restTemplate.postForEntity(HOST + path, requestMap, String.class);
        String responseString = responseBody.getBody();
        try {
            JSONObject jsonObject = JSON.parseObject(responseString);
            Integer code = jsonObject.getInteger("code");
            if (code != 0) {
                LOG.error("获取用户省编码失败 ， account:%s , reason: %s", account, jsonObject.getString("msg"));
                throw new RuntimeException("请求错误");
            } else {
                if (JSON_DATA_TYPE_ARRAY.equals(dataType)) {
                    JSONArray data = jsonObject.getJSONArray("data");
                    return callback.apply(data);
                } else {
                    JSONObject data = jsonObject.getJSONObject("data");
                    return callback.apply(data);
                }

            }
        } catch (Exception err) {
            throw new RuntimeException("");
        }
    }

    private Map<String, String> getRequestMap(String userAccount, String shopId) {
        Calendar c = Calendar.getInstance();
        c.setTime(new Date());
        c.add(Calendar.YEAR, -1);  //上一年
        c.set(Calendar.MONTH, 1);
        Map<String, String> reqMap = new HashMap<>();
        reqMap.put("user_account", userAccount);
        reqMap.put("shop_id", shopId);
        DateFormat df = new SimpleDateFormat("YYYY-MM");
        reqMap.put("date", df.format(c.getTime()));
        return reqMap;
    }


    @Override
    public Quota getBusinessCirclePopulation(String userAccount, ChancePoint chancePoint, Date date) {
        try {
            Map reqMap = getRequestMap(userAccount, chancePoint.getChanceId());
            return request(userAccount, "/business_circle_population", reqMap, JSON_DATA_TYPE_OBJECT, (jsonobject) -> {
                Quota ret = new Quota();
                ret.setLabel("商圈人口体量");
                ret.setType("business_circle_population");
                JSONObject jo = (JSONObject) jsonobject;
                String uv = jo.getString("uv"); //人口总量
                QuotaItem<String> uvItem = new QuotaItem();
                uvItem.setLabel("人口总量");
                uvItem.setValue(uv);
                uvItem.setType("uv");

                ret.add(uvItem);

                String stay = jo.getString("stay");
                QuotaItem stayItem = new QuotaItem();
                stayItem.setLabel("固定人口");
                stayItem.setValue(stay);
                stayItem.setType("stay");

                ret.add(stayItem);

                String move = jo.getString("move");
                QuotaItem moveItem = new QuotaItem();
                moveItem.setLabel("流动人口");
                moveItem.setValue(move);
                moveItem.setType("move");
                ret.add(moveItem);
                return ret;
            });
        } catch (Exception e) {
            return null;
        }
    }

    @Override
    public Quota getBusinessCircleActive(String userAccount, ChancePoint chancePoint, Date date) {
        try {
            Map reqMap = getRequestMap(userAccount, chancePoint.getChanceId());
            return request(userAccount, "/business_circle_active", reqMap, JSON_DATA_TYPE_OBJECT, (jsonobject) -> {
                Quota ret = new Quota();
                ret.setLabel("商圈活跃度");
                ret.setType("business_circle_active");
                JSONObject jo = (JSONObject) jsonobject;
                String businessEnty = jo.getString("business_enty"); //人口总量
                QuotaItem item = new QuotaItem();
                item.setLabel("商业主体数量");
                item.setValue(businessEnty);
                item.setType("businessEnty");

                ret.add(item);

                String businessBuilding = jo.getString("business_building");
                item = new QuotaItem();
                item.setLabel("商务楼数量");
                item.setValue(businessBuilding);
                item.setType("businessBuilding");

                ret.add(item);

                String community = jo.getString("community");
                QuotaItem moveItem = new QuotaItem();
                moveItem.setLabel("社区数量");
                moveItem.setValue(community);
                moveItem.setType("community");
                ret.add(moveItem);
                return ret;
            });
        } catch (Exception e) {
            return null;
        }
    }

    @Override
    public Quota getBusinessCircleActiveTop(String userAccount, ChancePoint chancePoint, Date date) {
        try {
            Map reqMap = getRequestMap(userAccount, chancePoint.getChanceId());
            return request(userAccount, "/get_business_circle_active_top", reqMap, JSON_DATA_TYPE_ARRAY, (jsonobject) -> {
                Quota ret = new Quota();
                ret.setLabel("商圈活跃度Top榜");
                ret.setType("get_business_circle_active_top");
                ret.setRemark("商圈内商业主体、商务楼、社区距离top榜");
                JSONArray ja = (JSONArray) jsonobject;
                for (int i = 0; i < ja.size(); i++) {
                    JSONObject data = ja.getJSONObject(i);
                    String label = data.getString("name");
                    QuotaItem<List> item = new QuotaItem<>();
                    item.setLabel(label);
                    JSONArray values = data.getJSONArray("value");
                    List<QuotaItem> _datas = new ArrayList<>();
                    for (int j = 0; j < values.size(); j++) {
                        JSONObject subdata = values.getJSONObject(j);
                        QuotaItem subItem = new QuotaItem();
                        subItem.setLabel(subdata.getString("name"));
                        subItem.setValue(subdata.getString("value"));
                        _datas.add(subItem);
                    }
                    item.setValue(_datas);
                    ret.add(item);
                }

                return ret;
            });
        } catch (Exception e) {
            return null;
        }
    }

    @Override
    public Quota getBusinessDistrictPopulation(String userAccount, ChancePoint chancePoint, Date date) {

        try {
            Map reqMap = getRequestMap(userAccount, chancePoint.getChanceId());
            return request(userAccount, "/business_district_population", reqMap, JSON_DATA_TYPE_OBJECT, (jsonobject) -> {
                Quota ret = new Quota();
                ret.setLabel("商区人口体量");
                ret.setType("business_district_population");
                JSONObject jo = (JSONObject) jsonobject;
                String uv = jo.getString("uv"); //人口总量
                QuotaItem<String> uvItem = new QuotaItem();
                uvItem.setLabel("人口总量");
                uvItem.setValue(uv);
                uvItem.setType("uv");

                ret.add(uvItem);

                String stay = jo.getString("stay");
                QuotaItem stayItem = new QuotaItem();
                stayItem.setLabel("固定人口");
                stayItem.setValue(stay);
                stayItem.setType("stay");

                ret.add(stayItem);

                String move = jo.getString("move");
                QuotaItem moveItem = new QuotaItem();
                moveItem.setLabel("流动人口");
                moveItem.setValue(move);
                moveItem.setType("move");
                ret.add(moveItem);
                return ret;
            });
        } catch (Exception e) {
            return null;
        }
    }

    @Override
    public Quota getBusinessDistrictCustomerActive(String userAccount, ChancePoint chancePoint, Date date) {
        try {
            Map reqMap = getRequestMap(userAccount, chancePoint.getChanceId());
            return request(userAccount, "/business_district_customer_active", reqMap, JSON_DATA_TYPE_ARRAY, (jsonobject) -> {
                Quota ret = new Quota();
                ret.setLabel("商区消费者活跃度");
                ret.setType("business_district_customer_active");
                ret.setRemark("商区内年龄段占比");
                JSONArray ja = (JSONArray) jsonobject;
                for (int i = 0; i < ja.size(); i++) {
                    JSONObject v = ja.getJSONObject(i);
                    String name = v.getString("name");
                    String value = v.getString("value");
                    QuotaItem item = new QuotaItem();
                    item.setValue(value);
                    item.setLabel(name);
                    ret.add(item);
                }
                return ret;
            });
        } catch (Exception e) {
            return null;
        }
    }

    @Override
    public Quota getBusinessDistrictCustomerChildrenProportion(String userAccount, ChancePoint chancePoint, Date date) {
        try {
            Map reqMap = getRequestMap(userAccount, chancePoint.getChanceId());
            return request(userAccount, "/business_district_customer_children_proportion", reqMap, JSON_DATA_TYPE_ARRAY, (jsonobject) -> {
                Quota ret = new Quota();
                ret.setLabel("商区消费者有子女占比");
                ret.setType("business_district_customer_children_proportion");
                ret.setRemark("商区内有无子女占比");
                JSONArray ja = (JSONArray) jsonobject;
                for (int i = 0; i < ja.size(); i++) {
                    JSONObject v = ja.getJSONObject(i);
                    String name = v.getString("name");
                    String value = v.getString("value");
                    QuotaItem item = new QuotaItem();
                    item.setValue(value);
                    item.setLabel(name);
                    ret.add(item);
                }
                return ret;
            });
        } catch (Exception e) {
            return null;
        }
    }

    @Override
    public Quota getBusinessDistrictActive(String userAccount, ChancePoint chancePoint, Date date) {

        try {
            Map reqMap = getRequestMap(userAccount, chancePoint.getChanceId());
            return request(userAccount, "/business_district_active", reqMap, JSON_DATA_TYPE_OBJECT, (jsonobject) -> {
                Quota ret = new Quota();
                ret.setLabel("商区活跃度");
                ret.setType("business_district_active");
                JSONObject jo = (JSONObject) jsonobject;
                String businessEnty = jo.getString("business_enty"); //人口总量
                QuotaItem item = new QuotaItem();
                item.setLabel("商业主体数量");
                item.setValue(businessEnty);
                item.setType("businessEnty");

                ret.add(item);

                String businessBuilding = jo.getString("business_building");
                item = new QuotaItem();
                item.setLabel("商务楼数量");
                item.setValue(businessBuilding);
                item.setType("businessBuilding");

                ret.add(item);

                String community = jo.getString("community");
                QuotaItem moveItem = new QuotaItem();
                moveItem.setLabel("社区数量");
                moveItem.setValue(community);
                moveItem.setType("community");
                ret.add(moveItem);
                return ret;
            });
        } catch (Exception e) {
            return null;
        }
    }

    @Override
    public Quota getBusinessDistrictMating(String userAccount, ChancePoint chancePoint, Date date) {

        try {
            Map reqMap = getRequestMap(userAccount, chancePoint.getChanceId());
            return request(userAccount, "/business_district_mating", reqMap, JSON_DATA_TYPE_ARRAY, (jsonobject) -> {
                Quota ret = new Quota();
                ret.setLabel("商区关键配套");
                ret.setType("business_district_mating");
                ret.setRemark("商区内银行、房产中介、超市、便利店、高校、医院数量");
                JSONArray ja = (JSONArray) jsonobject;
                for (int i = 0; i < ja.size(); i++) {
                    JSONObject v = ja.getJSONObject(i);
                    String name = v.getString("name");
                    String value = v.getString("value");
                    QuotaItem item = new QuotaItem();
                    item.setValue(value);
                    item.setLabel(name);
                    ret.add(item);
                }
                return ret;
            });
        } catch (Exception e) {
            return null;
        }
    }

    @Override
    public Quota getBusinessDistrictBusNum(String userAccount, ChancePoint chancePoint, Date date) {
        try {
            Map reqMap = getRequestMap(userAccount, chancePoint.getChanceId());
            return request(userAccount, "/business_district_bus_num", reqMap, JSON_DATA_TYPE_OBJECT, (jsonobject) -> {
                Quota ret = new Quota();
                ret.setLabel("商区公交路线数量、公交站点数");
                ret.setType("business_district_bus_num");
                JSONObject jo = (JSONObject) jsonobject;
                String busRoutes = jo.getString("bus_routes");
                QuotaItem item = new QuotaItem();
                item.setLabel("公交线");
                item.setValue(busRoutes);
                item.setType("busRoutes");

                ret.add(item);

                String busStops = jo.getString("bus_stops");
                item = new QuotaItem();
                item.setLabel("公交站");
                item.setValue(busStops);
                item.setType("busStops");

                ret.add(item);
                return ret;
            });
        } catch (Exception e) {
            return null;
        }
    }

    @Override
    public Quota getBusinessDistrictActiveTop(String userAccount, ChancePoint chancePoint, Date date) {

        try {
            Map reqMap = getRequestMap(userAccount, chancePoint.getChanceId());
            return request(userAccount, "/get_business_district_active_top", reqMap, JSON_DATA_TYPE_ARRAY, (jsonobject) -> {
                Quota ret = new Quota();
                ret.setLabel("商区活跃度Top榜");
                ret.setType("get_business_district_active_top");
                ret.setRemark("商区内商业主体、商务楼、社区距离top榜");
                JSONArray ja = (JSONArray) jsonobject;
                for (int i = 0; i < ja.size(); i++) {
                    JSONObject data = ja.getJSONObject(i);
                    String label = data.getString("name");
                    QuotaItem<List> item = new QuotaItem<>();
                    item.setLabel(label);
                    JSONArray values = data.getJSONArray("value");
                    List<QuotaItem> _datas = new ArrayList<>();
                    for (int j = 0; j < values.size(); j++) {
                        JSONObject subdata = values.getJSONObject(j);
                        QuotaItem subItem = new QuotaItem();
                        subItem.setLabel(subdata.getString("name"));
                        subItem.setValue(subdata.getString("value"));
                        _datas.add(subItem);
                    }
                    item.setValue(_datas);
                    ret.add(item);
                }

                return ret;
            });
        } catch (Exception e) {
            return null;
        }
    }

    @Override
    public Quota getBusinessDistrictMatingTop(String userAccount, ChancePoint chancePoint, Date date) {

        try {
            Map reqMap = getRequestMap(userAccount, chancePoint.getChanceId());
            return request(userAccount, "/get_business_district_mating_top", reqMap, JSON_DATA_TYPE_ARRAY, (jsonobject) -> {
                Quota ret = new Quota();
                ret.setLabel("商区关键配套Top榜");
                ret.setType("get_business_district_mating_top");
                ret.setRemark("商区内银行、房产中介、超市、便利店、高校、医院top榜");
                JSONArray ja = (JSONArray) jsonobject;
                for (int i = 0; i < ja.size(); i++) {
                    JSONObject data = ja.getJSONObject(i);
                    String label = data.getString("name");
                    QuotaItem<List> item = new QuotaItem<>();
                    item.setLabel(label);
                    JSONArray values = data.getJSONArray("value");
                    List<QuotaItem> _datas = new ArrayList<>();
                    for (int j = 0; j < values.size(); j++) {
                        JSONObject subdata = values.getJSONObject(j);
                        QuotaItem subItem = new QuotaItem();
                        subItem.setLabel(subdata.getString("name"));
                        subItem.setValue(subdata.getString("value"));
                        _datas.add(subItem);
                    }
                    item.setValue(_datas);
                    ret.add(item);
                }

                return ret;
            });
        } catch (Exception e) {
            return null;
        }
    }

    @Override
    public Quota getBusinessDistrictBusTop(String userAccount, ChancePoint chancePoint, Date date) {

        try {
            Map reqMap = getRequestMap(userAccount, chancePoint.getChanceId());
            return request(userAccount, "/get_business_district_bus_top", reqMap, JSON_DATA_TYPE_ARRAY, (jsonobject) -> {
                Quota ret = new Quota();
                ret.setLabel("商区关键配套Top榜");
                ret.setType("get_business_district_bus_top");
                ret.setRemark("商区内公交路线数量、公交站点距离 top榜");
                JSONArray ja = (JSONArray) jsonobject;
                for (int i = 0; i < ja.size(); i++) {
                    JSONObject data = ja.getJSONObject(i);
                    String label = data.getString("name");
                    QuotaItem<List> item = new QuotaItem<>();
                    item.setLabel(label);
                    JSONArray values = data.getJSONArray("value");
                    List<QuotaItem> _datas = new ArrayList<>();
                    for (int j = 0; j < values.size(); j++) {
                        JSONObject subdata = values.getJSONObject(j);
                        QuotaItem subItem = new QuotaItem();
                        subItem.setLabel(subdata.getString("name"));
                        subItem.setValue(subdata.getString("value"));
                        _datas.add(subItem);
                    }
                    item.setValue(_datas);
                    ret.add(item);
                }

                return ret;
            });
        } catch (Exception e) {
            return null;
        }
    }

    @Override
    public Quota getStreetMating(String userAccount, ChancePoint chancePoint, Date date) {
        try {
            Map reqMap = getRequestMap(userAccount, chancePoint.getChanceId());
            reqMap.put("street" , chancePoint.getAddress());
            return request(userAccount, "/street_mating", reqMap, JSON_DATA_TYPE_ARRAY, (jsonobject) -> {
                Quota ret = new Quota();
                ret.setLabel("街道关键配套");
                ret.setType("street_mating");
                ret.setRemark("主要街道内银行、房产中介、超市、便利店、高校、医院数量");
                JSONArray ja = (JSONArray) jsonobject;
                for (int i = 0; i < ja.size(); i++) {
                    JSONObject data = ja.getJSONObject(i);
                    String label = data.getString("name");
                    QuotaItem<List> item = new QuotaItem<>();
                    item.setLabel(label);
                    JSONArray values = data.getJSONArray("value");
                    List<QuotaItem> _datas = new ArrayList<>();
                    for (int j = 0; j < values.size(); j++) {
                        JSONObject subdata = values.getJSONObject(j);
                        QuotaItem subItem = new QuotaItem();
                        subItem.setLabel(subdata.getString("name"));
                        subItem.setValue(subdata.getString("value"));
                        _datas.add(subItem);
                    }
                    item.setValue(_datas);
                    ret.add(item);
                }

                return ret;
            });
        } catch (Exception e) {
            return null;
        }
    }

    @Override
    public Quota getStreetTop(String userAccount, ChancePoint chancePoint, Date date) {

        try {
            Map reqMap = getRequestMap(userAccount, chancePoint.getChanceId());
            reqMap.put("street" , chancePoint.getAddress());
            return request(userAccount, "/get_street_top", reqMap, JSON_DATA_TYPE_ARRAY, (jsonobject) -> {
                Quota ret = new Quota();
                ret.setLabel("街道关键配套Top榜");
                ret.setType("get_street_top");
                ret.setRemark("街道内银行、房产中介、超市、便利店、高校、医院距离top榜");
                JSONArray ja = (JSONArray) jsonobject;
                for (int i = 0; i < ja.size(); i++) {
                    JSONObject data = ja.getJSONObject(i);
                    String label = data.getString("name");
                    QuotaItem<List> item = new QuotaItem<>();
                    item.setLabel(label);
                    JSONArray values = data.getJSONArray("value");
                    List<QuotaItem> _datas = new ArrayList<>();
                    for (int j = 0; j < values.size(); j++) {
                        JSONObject subdata = values.getJSONObject(j);
                        QuotaItem subItem = new QuotaItem();
                        subItem.setLabel(subdata.getString("name"));
                        subItem.setValue(subdata.getString("value"));
                        _datas.add(subItem);
                    }
                    item.setValue(_datas);
                    ret.add(item);
                }

                return ret;
            });
        } catch (Exception e) {
            return null;
        }
    }
}
