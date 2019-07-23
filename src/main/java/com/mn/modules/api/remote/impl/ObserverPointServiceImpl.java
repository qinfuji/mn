package com.mn.modules.api.remote.impl;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.mn.modules.api.remote.ObservePointService;
import com.mn.modules.api.utils.LngLat;
import com.mn.modules.api.vo.ArrivedData;
import com.mn.modules.api.vo.ObserverPoint;
import com.mn.modules.api.vo.ObserverPointData;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.List;

@Component
public class ObserverPointServiceImpl implements ObservePointService {


    private static final String HOST = "http://www.topprismdata.com/_thrid/address";
    //测控点列表
    private static final String GETPOINT_PATH = "/getpoint";
    //测控点客流量
    private static final String GETFLOW_PATH = "/getflow";
    //测控点到访数据
    private static final String ARRIVED_PATH = "http://www.topprismdata.com/thrid/address/arrive";

    @Autowired
    RestTemplate restTemplate;

    public ObserverPointServiceImpl() {
    }

    public ObserverPointServiceImpl(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    @Override
    public List<ObserverPoint> getObserverPointList(String token) {


        MultiValueMap<String, String> requestMap = new LinkedMultiValueMap<String, String>();
        requestMap.add("token", token);
        ResponseEntity<String> responseBody = restTemplate.getForEntity(HOST + GETPOINT_PATH, String.class, requestMap);
        String responseString = responseBody.getBody();

        JSONObject jsonObject = JSON.parseObject(responseString);
        Integer code = jsonObject.getInteger("code");

        if (code != 0) {
            return new ArrayList<>();
        }

        JSONArray points = jsonObject.getJSONArray("points");
        List<ObserverPoint> rets = new ArrayList<>();

        for (int i = 0; i < points.size(); i++) {
            ObserverPoint op = new ObserverPoint();
            JSONObject jo = points.getJSONObject(i);
            op.setId(jo.getString("id"));
            op.setPointename(jo.getString("pointname"));
            rets.add(op);
        }
        return rets;
    }

    @Override
    public List<ArrivedData> getObserveArrivedData(String observerId, String token) {

        List<ArrivedData> arrivedDataList = new ArrayList<>();

        MultiValueMap<String, String> requestMap = new LinkedMultiValueMap<String, String>();
        ResponseEntity<String> responseBody = restTemplate.postForEntity("http://www.topprismdata.com/third/address/arrive", requestMap ,String.class);
        String responseString = responseBody.getBody();

        JSONObject jsonObject = JSON.parseObject(responseString);
        Integer code = jsonObject.getInteger("code");
        if (code.intValue() == 0) {
            JSONArray arrivedArray = jsonObject.getJSONArray("res");
            if (arrivedArray != null && arrivedArray.size() > 0) {
                for (int i = 0; i < arrivedArray.size(); i++) {
                    JSONObject jo = arrivedArray.getJSONObject(i);
                    //TODO 当前接口返回的数据是反的，以后改了这里在调整
                    double lng = jo.getDouble("lat");
                    double lat = jo.getDouble("lng");
                    double count = jo.getDouble("count");

                    ArrivedData ad = new ArrivedData();
                    ad.setArrivedRate(count);
                    ad.setLngLat(new LngLat(lng, lat));
                    arrivedDataList.add(ad);
                }
            }
        }
        return arrivedDataList;
    }

    @Override
    public Integer getObserveFlow(String observerId, String token) {
        ObserverPointData opd = new ObserverPointData();

        MultiValueMap<String, String> requestMap = new LinkedMultiValueMap<String, String>();
        requestMap.add("token", token);
        ResponseEntity<String> responseBody = restTemplate.getForEntity(HOST + GETFLOW_PATH + "/" + observerId, String.class, requestMap);
        String responseString = responseBody.getBody();

        JSONObject jsonObject = JSON.parseObject(responseString);
        Integer code = jsonObject.getInteger("code");
        if (code != 0) {
            Integer flowCount = jsonObject.getInteger("total");
            return flowCount;
        }
        return 0;
    }
}
