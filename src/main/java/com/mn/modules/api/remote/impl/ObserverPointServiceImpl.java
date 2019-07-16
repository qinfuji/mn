package com.mn.modules.api.remote.impl;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.mn.modules.api.remote.ObservePointService;
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
    private static final String GETPOINT_PATH = "/getpoint";
    private static final String GETFLOW_PATH = "/getflow";

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
        ResponseEntity<String> responseBody = restTemplate.getForEntity(HOST+GETPOINT_PATH , String.class  , requestMap  );
        String responseString = responseBody.getBody();

        JSONObject jsonObject = JSON.parseObject(responseString);
        Integer code = jsonObject.getInteger("code");

        if(code !=0){
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
    public ObserverPointData getObserveData(String observerId , String token) {

        ObserverPointData opd = new ObserverPointData();

        MultiValueMap<String, String> requestMap = new LinkedMultiValueMap<String, String>();
        requestMap.add("token", token);
        ResponseEntity<String> responseBody = restTemplate.getForEntity(HOST+GETPOINT_PATH+"/"+observerId , String.class  , requestMap  );
        String responseString = responseBody.getBody();

        JSONObject jsonObject = JSON.parseObject(responseString);
        Integer code = jsonObject.getInteger("code");
        if(code !=0){
            Integer flowCount = jsonObject.getInteger("total");
            opd.setFlowCount(flowCount);
        }
        return opd;
    }
}
