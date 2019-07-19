package com.mn.modules.api.remote.impl;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.mn.modules.api.entity.GeographyPoint;
import com.mn.modules.api.remote.GaodeMapService;
import com.mn.modules.api.utils.LngLat;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

@Service
public class GaodeMapServiceImpl implements GaodeMapService {

    private static Logger logger = LoggerFactory.getLogger(AuthServiceImpl.class);

    private static final String GET_ADDRESS_URL = "http://restapi.amap.com/v3/geocode/regeo";

    private static final String KEY = "f7afe9ac13d8d7afcfdd07b8e8e551fa";

    @Autowired
    RestTemplate restTemplate;


    @Override
    public GeographyPoint getGeographyPointByLnglat(LngLat lnglat) {

        MultiValueMap<String, String> requestMap = new LinkedMultiValueMap<String, String>();
        requestMap.add("key", KEY);
        requestMap.add("location" , lnglat.getLng()+","+lnglat.getLat());
        ResponseEntity<String>  responseBody = restTemplate.getForEntity(GET_ADDRESS_URL, String.class , requestMap);
        String responseString = responseBody.getBody();
        if(logger.isInfoEnabled()){
             logger.info("用户请求： {}", responseString);
        }
        JSONObject jsonObject = JSON.parseObject(responseString);
        Integer state = jsonObject.getInteger("status");
        if(state.intValue() !=1){
            String info = jsonObject.getString("info");
            logger.error("用户请求： {}", info);
            return null;
        }

        JSONObject regeocodes = jsonObject.getJSONObject("regeocodes");
        JSONObject addressComponent = regeocodes.getJSONObject("addressComponent");

        String district = addressComponent.getString("adcode");
        //String districtName = addressComponent.getString("district");

        GeographyPoint gp =  AdcodeData.getCodeInfo(district);
        gp.setLng(lnglat.getLng());
        gp.setLat(lnglat.getLat());

        return gp;
    }
}
