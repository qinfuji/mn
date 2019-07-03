package com.mn.modules.api.remote.impl;

import com.mn.modules.api.remote.ObservePointService;
import com.mn.modules.api.vo.ObserverPoint;
import com.mn.modules.api.vo.ObserverPointData;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.List;

@Component
public class ObserverPointServiceImpl implements ObservePointService {

    @Autowired
    RestTemplate restTemplate;

    public ObserverPointServiceImpl() {
    }

    public ObserverPointServiceImpl(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    @Override
    public List<ObserverPoint> getObserverPointList() {


//        Map<String, String> map = new HashMap<>();
//        map.put("user_account", account);
//        map.put("appid", APPID);
//
//        Map signParamMap = Tools.sign(map, TOKEN);
//        MultiValueMap<String, String> requestMap = new LinkedMultiValueMap<String, String>();
//        signParamMap.forEach((key, value) -> {
//            requestMap.add((String) key, (String) value);
//        });
//
//        ResponseEntity<String> responseBody = restTemplate.postForEntity(HOST + PROVINCE_PATH, requestMap, String.class);
//        String responseString = responseBody.getBody();
//        try {
//            Map _ret = getResultMap(account, responseString);
//
//            return _ret;
//        } catch (Exception err) {
//            throw new RuntimeException("");
//        }

        return null;
    }

    @Override
    public List<ObserverPointData> getObserveData(String observerId) {
        return null;
    }
}
